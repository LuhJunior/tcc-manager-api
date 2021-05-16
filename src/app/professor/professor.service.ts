import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Professor,
  ProfessorAdvisor,
  ProfessorTcc,
  Prisma,
} from '@prisma/client';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async createProfessor(data: Prisma.ProfessorCreateInput): Promise<Professor> {
    return this.prisma.professor.create({ data });
  }

  async createProfessorAdvisor(data: Prisma.ProfessorAdvisorCreateInput): Promise<ProfessorAdvisor> {
    return this.prisma.professorAdvisor.create({ data });
  }

  async createProfessorTcc(data: Prisma.ProfessorTccCreateInput): Promise<ProfessorTcc> {
    return this.prisma.professorTcc.create({ data });
  }

  async professor(professorWhereUniqueInput: Prisma.ProfessorWhereUniqueInput) {
    const professor = await this.prisma.professor.findUnique({
      where: professorWhereUniqueInput,
      include: {
        professorAdvisor: {
          include: {
            projects: true,
          },
        },
        professorTcc: {
          include: {
            classes: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });

    if (professor?.deletedAt) {
      return null;
    }

    return professor;
  }

  async professorByProfessorAdvisorId(id: string): Promise<Professor | null> {
    const professor = await this.prisma.professor.findFirst({
      where: {
        professorAdvisor: {
          id,
        },
      },
      include: {
        professorAdvisor: true,
      },
    });

    if (professor?.deletedAt) {
      return null;
    }

    return professor;
  }

  async professors({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProfessorWhereUniqueInput;
    where?: Prisma.ProfessorWhereInput;
    orderBy?: Prisma.ProfessorOrderByInput;
  }) {
    return this.prisma.professor.findMany({
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
            projects: true,
          },
        },
        professorTcc: {
          include: {
            classes: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });
  }

  async updateProfessor({ data, where }: {
    where: Prisma.ProfessorWhereUniqueInput;
    data: Prisma.ProfessorUpdateInput;
  }): Promise<Professor | null> {
    const professor = await this.prisma.professor.findUnique({ where });

    if (!professor || professor.deletedAt) {
      return null;
    }

    return this.prisma.professor.update({
      data,
      where,
    });
  }

  async deleteProfessor(where: Prisma.ProfessorWhereUniqueInput): Promise<Professor | null> {
    const professor = await this.prisma.professor.findUnique({ where });

    if (!professor || professor.deletedAt) {
      return null;
    }

    return this.prisma.professor.update({
      data: {
        deletedAt: new Date(),
        professorAdvisor: {
          update: {
            deletedAt: new Date(),
          },
        },
        professorTcc: {
          update: {
            deletedAt: new Date(),
          },
        },
      },
      where,
    });
  }
}