import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Class,
  Semester,
  ProfessorTccOnClass,
  ProfessorTcc,
  Prisma,
} from '@prisma/client';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(data: Prisma.ClassCreateInput): Promise<Class & { semester: Semester }> {
    return this.prisma.class.create({ data, include: { semester: true, professors: true } });
  }

  async createProfessorTccOnClass(data: Prisma.ProfessorTccOnClassCreateInput): Promise<ProfessorTccOnClass & { professorTcc: ProfessorTcc; class: Class }> {
    return this.prisma.professorTccOnClass.create({ data, include: { professorTcc: true, class: true } });
  }

  async createSemester(data: Prisma.SemesterCreateInput): Promise<Semester> {
    return this.prisma.semester.create({ data });
  }

  async class(where: Prisma.ClassWhereUniqueInput) {
    const classroom = await this.prisma.class.findUnique({
      where,
      include: {
        professors: {
          include: {
            professorTcc: {
              include: {
                professor: true,
              },
            },
          },
        },
        students: true,
        semester: true,
      },
    });

    if (!classroom || classroom.deletedAt) {
      return null;
    }

    return classroom;
  }

  async professorTccOnclass(where: Prisma.ProfessorTccOnClassWhereUniqueInput) {
    const poc = await this.prisma.professorTccOnClass.findUnique({
      where,
      include: {
        class: true,
        professorTcc: true,
      },
    });

    if (!poc || poc.deletedAt) {
      return null;
    }

    return poc;
  }

  async firstProfessorTccOnclass(where: Prisma.ProfessorTccOnClassWhereInput) {
    const poc = await this.prisma.professorTccOnClass.findFirst({
      where,
      include: {
        class: true,
        professorTcc: true,
      },
    });

    if (!poc || poc.deletedAt) {
      return null;
    }

    return poc;
  }

  async checkClass(where: Prisma.ClassWhereUniqueInput) {
    return await this.prisma.class.findUnique({ where }) !== null;
  }

  async semester(where: Prisma.SemesterWhereUniqueInput) {
    const semester = await this.prisma.semester.findUnique({
      where,
      include: {
        classes: true,
      },
    });

    if (!semester || semester.deletedAt) {
      return null;
    }

    return semester;
  }

  async checkSemester(where: Prisma.SemesterWhereUniqueInput) {
    return await this.prisma.semester.findUnique({ where }) !== null;
  }

  async currentSemester() {
    return this.prisma.semester.findFirst({
      where: {
        OR: [
          {
            startPeriod: {
              gte: new Date(),
            },
          },
          {
            AND: [
              {
                startPeriod: {
                  lte: new Date(),
                },
              },
              {
                endPeriod: {
                  gt: new Date(),
                },
              },
            ],
          },
        ],
        deletedAt: null,
      },
      include: {
        classes: true,
      },
      orderBy: {
        startPeriod: 'asc',
      },
    });
  }

  async semesters({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SemesterWhereUniqueInput;
    where?: Prisma.SemesterWhereInput;
    orderBy?: Prisma.SemesterOrderByInput;
  }): Promise<Array<Semester & { classes: Class[] }>> {
    return this.prisma.semester.findMany({
      skip,
      take,
      cursor,
      where: {
        ...where,
        deletedAt: null,
      },
      orderBy,
      include: {
        classes: true,
      },
    });
  }

  async conflictPeriodSemester(start: Date, end: Date) {
    return this.prisma.semester.findFirst({
      where: {
        OR: [
          {
            AND: [
              {
                startPeriod: {
                  lte: start,
                },
              },
              {
                endPeriod: {
                  gte: start,
                },
              },
            ],
          },
          {
            AND: [
              {
                startPeriod: {
                  lte: end,
                },
              },
              {
                endPeriod: {
                  gte: end,
                },
              },
            ],
          },
        ],
        deletedAt: null,
      },
      include: {
        classes: true,
      },
      orderBy: {
        startPeriod: 'asc',
      },
    });
  }

  async classes({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClassWhereUniqueInput;
    where?: Prisma.ClassWhereInput;
    orderBy?: Prisma.ClassOrderByInput;
  }) {
    return this.prisma.class.findMany({
      skip,
      take,
      cursor,
      where: {
        ...where,
        deletedAt: null,
      },
      orderBy,
      include: {
        semester: true,
        professors: {
          include: {
            professorTcc: {
              include: {
                professor: true,
              },
            },
          },
        },
      },
    });
  }

  async updateClass(where: Prisma.ClassWhereUniqueInput, data: Prisma.ClassUpdateInput): Promise<Class & { semester: Semester } | null> {
    const classroom = await this.prisma.class.findUnique({ where });

    if (!classroom || classroom.deletedAt) {
      return null;
    }

    return this.prisma.class.update({
      data,
      where,
      include: {
        professors: true,
        students: true,
        semester: true,
      },
    });
  }

  async deleteClass(where: Prisma.ClassWhereUniqueInput) {
    const classroom = await this.prisma.class.findUnique({ where });

    if (!classroom || classroom.deletedAt) {
      return null;
    }

    return this.prisma.class.update({ data: { deletedAt: new Date() }, where, include: { semester: true } });
  }

  async hardDeleteSemester(where: Prisma.SemesterWhereUniqueInput) {
    const semester = await this.prisma.semester.findUnique({ where });

    if (!semester || semester.deletedAt) {
      return null;
    }

    return this.prisma.semester.delete({ where, include: { classes: true } });
  }
}
