import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  Professor,
  Prisma,
} from '@prisma/client';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async createProfessor(data: Prisma.ProfessorCreateInput): Promise<Professor> {
    return this.prisma.professor.create({
      data,
    });
  }

  async professor(professorWhereUniqueInput: Prisma.ProfessorWhereUniqueInput): Promise<Professor | null> {
    return this.prisma.professor.findUnique({
      where: professorWhereUniqueInput,
      include: {
        professorAdvisor: {
          include: {
            projects: true,
          },
        },
        professorTcc: true,
      },
    });
  }

  async professors({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProfessorWhereUniqueInput;
    where?: Prisma.ProfessorWhereInput;
    orderBy?: Prisma.ProfessorOrderByInput;
  }): Promise<Professor[]> {
    return this.prisma.professor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        professorAdvisor: {
          include: {
            projects: true,
          },
        },
        professorTcc: true,
      },
    });
  }

  async updateProfessor({ data, where }: {
    where: Prisma.ProfessorWhereUniqueInput;
    data: Prisma.ProfessorUpdateInput;
  }): Promise<Professor> {
    return this.prisma.professor.update({
      data,
      where,
    });
  }

  async deleteProfessor(where: Prisma.ProfessorWhereUniqueInput): Promise<Professor> {
    return this.prisma.professor.update({
      data: {
        deletedAt: new Date(),
      },
      where,
    });
  }
}