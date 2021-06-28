import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Project,
  Application,
  Prisma,
  ProjectStatus
} from '@prisma/client';
import { FileDto } from './project.dto';

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

  async createProjectApplication(projectId: string, studentId: string): Promise<Application | null> {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });

    if (!project || project.deletedAt || !student || student.deletedAt) {
      return null;
    }

    return this.prisma.application.create({
      data: {
        project: { connect: { id: projectId } },
        student: { connect: { id: studentId } },
      },
    });
  }

  async acceptProjectApplication(applicationId: string, professorAdvisorId: string): Promise<{ project: Project, application: Application } | null> {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { project: true } });

    if (!application || application.deletedAt || !application.project || application.project.deletedAt || application.project.professorAdvisorId !== professorAdvisorId) {
      return null;
    }

    const [updatedApplication, updatedProject] = await this.prisma.$transaction([
      this.prisma.application.update({
        data: {
          status: 'ACCEPTED',
        },
        where: {
          id: applicationId,
        },
      }),
      this.prisma.project.update({
        data: {
          status: 'IN_PROGRESS',
        },
        where: {
          id: application.projectId,
        },
      }),
      this.prisma.application.updateMany({
        data: {
          deletedAt: new Date(),
        },
        where: {
          status: 'IN_PROGRESS',
          projectId: application.projectId,
          deletedAt: null,
          NOT: {
            studentId: application.studentId,
          },
        },
      }),
      this.prisma.application.updateMany({
        data: {
          deletedAt: new Date(),
        },
        where: {
          status: 'IN_PROGRESS',
          studentId: application.studentId,
          deletedAt: null,
          NOT: {
            projectId: application.projectId,
          },
        },
      }),
    ]);

    return ({ project: updatedProject, application: updatedApplication });
  }

  async rejectProjectApplication(applicationId: string, professorAdvisorId: string): Promise<Application> {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { project: true } });

    if (!application || application.deletedAt || !application.project || application.project.deletedAt || application.project.professorAdvisorId !== professorAdvisorId) {
      return null;
    }

    return this.prisma.application.update({
      data: {
        status: 'REJECTED',
      },
      where: {
        id: applicationId,
      },
    });
  }

  async application(where: Prisma.ApplicationWhereUniqueInput) {
    const application = await this.prisma.application.findUnique({
      where,
      include: {
        project: true,
      },
    });

    if (!application || application.deletedAt) {
      return null;
    }

    return application;
  }

  async applicationWithProfessor(where: Prisma.ApplicationWhereUniqueInput) {
    const application = await this.prisma.application.findUnique({
      where,
      include: {
        project: {
          include: {
            professorAdvisor: {
              include: {
                professor: true,
              },
            },
          },
        },
      },
    });

    if (!application || application.deletedAt) {
      return null;
    }

    return application;
  }

  async applications({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ApplicationWhereUniqueInput;
    where?: Prisma.ApplicationWhereInput;
    orderBy?: Prisma.ApplicationOrderByInput;
  }) {
    return this.prisma.application.findMany({
      skip,
      take,
      cursor,
      orderBy,
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        project: true,
      },
    });
  }

  async projectFile(where: Prisma.ProjectFileWhereUniqueInput) {
    const file = await this.prisma.projectFile.findUnique({
      where,
      include: {
        project: {
          include: {
            applications: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!file || file.deletedAt) {
      return null;
    }

    return file;
  }

  async project(projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput) {
    const project = await this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
      include: {
        professorAdvisor: {
          include: {
            professor: true,
          },
        },
        applications: {
          include: {
            student: true,
          },
          where: {
            deletedAt: null,
          },
        },
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!project || project.deletedAt) {
      return null;
    }

    return project;
  }

  async projects({ skip, take, cursor, where, whereApplication, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    where?: Prisma.ProjectWhereInput;
    whereApplication?: Prisma.ApplicationWhereInput;
    orderBy?: Prisma.ProjectOrderByInput;
  }) {
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
        applications: {
          include: {
            student: true,
          },
          where: {
            ...whereApplication,
            deletedAt: null,
          },
        },
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async updateProject({ where, data }: {
    where: Prisma.ProjectWhereUniqueInput & { professorAdvisorId?: string };
    data: Prisma.ProjectUpdateInput;
  }) {
    const { professorAdvisorId } = where;
    delete where.professorAdvisorId;
    const project = await this.prisma.project.findUnique({ where });

    if (!project || project.deletedAt || (professorAdvisorId && project.professorAdvisorId !== professorAdvisorId)) {
      return null;
    }

    return this.prisma.project.update({
      data,
      where,
      include: {
        professorAdvisor: {
          include: {
            professor: true,
          },
        },
        applications: {
          where: {
            deletedAt: null,
          },
        },
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async updateProjectFiles({ files, where }: {
    files: FileDto[];
    where: Prisma.ProjectWhereUniqueInput & { professorAdvisorId?: string; studentId: string };
  }) {
    const { professorAdvisorId, studentId } = where;
    delete where.professorAdvisorId;
    delete where.studentId;
    const project = await this.prisma.project.findUnique({
      where,
      include: {
        applications: {
          where: {
            deletedAt: null,
          },
        },
        professorAdvisor: true,
      },
    });

    if (!project
      || project.deletedAt
      || (professorAdvisorId && project.professorAdvisorId !== professorAdvisorId)
      || (studentId && !project.applications.find(a => a.studentId === studentId && a.status === 'ACCEPTED'))
    ) {
      return null;
    }

    return this.prisma.project.update({
      data: {
        files: {
          createMany: {
            data: files,
          },
        },
      },
      where,
      include: {
        professorAdvisor: {
          include: {
            professor: true,
          },
        },
        applications: {
          where: {
            deletedAt: null,
          },
        },
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async deleteProject(where: Prisma.ProjectWhereUniqueInput & { professorAdvisorId?: string }): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({ where });

    if (!project || project.deletedAt || (where.professorAdvisorId && project.professorAdvisorId !== where.professorAdvisorId)) {
      return null;
    }

    return this.prisma.project.update({
      data: {
        deletedAt: new Date(),
        applications: {
          updateMany: {
            data: {
              deletedAt: new Date(),
            },
            where: { projectId: where.id },
          },
        },
      },
      where,
    });
  }

  async deleteProjectApplication(applicationId: string, professorAdvisorId: string): Promise<Application> {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { project: true } });

    if (!application || application.deletedAt || !application.project || application.project.deletedAt || application.project.professorAdvisorId !== professorAdvisorId) {
      return null;
    }

    return this.prisma.application.update({
      data: {
        deletedAt: new Date(),
        project: application.status === 'ACCEPTED' ? {
          update: {
            status: 'ACTIVE',
          },
        } : undefined,
      },
      where: {
        id: applicationId,
      },
    });
  }

  async deleteProjectFile(where: Prisma.ProjectFileWhereUniqueInput) {
    const file = await this.prisma.projectFile.findUnique({ where });

    if (!file || file.deletedAt) {
      return null;
    }

    return this.prisma.projectFile.update({
      data: {
        deletedAt: new Date(),
      },
      where,
    });
  }
}