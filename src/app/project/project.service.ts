import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Project,
  Prisma,
  ProjectStatus
} from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...data,
        status: ProjectStatus.ACTIVE,
      },
    });
  }

  async project(projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
      include: {
        professorAdvisor: {
          include: {
            professor: true,
          },
        },
        applications: true,
        files: true,
      },
    });

    if (project?.deletedAt) {
      return null;
    }

    return project;
  }

  async projects({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByInput;
  }): Promise<Project[]> {
    return this.prisma.project.findMany({
      skip,
      take,
      cursor,
      where: {
        ...where,
        deletedAt: null,
      },
      orderBy,
      include: {
        professorAdvisor: {
          include: {
            professor: true,
          },
        },
        applications: true,
        files: true,
      },
    });
  }

  async updateProject({ where, data }: {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.ProjectUpdateInput;
  }): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({ where });

    if (!project || project.deletedAt) {
      return null;
    }

    return this.prisma.project.update({
      data,
      where,
    });
  }

  async deleteProject(where: Prisma.ProjectWhereUniqueInput): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({ where });

    if (!project || project.deletedAt) {
      return null;
    }

    return this.prisma.project.delete({
      where,
    });
  }
}