import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Class,
  Semester,
  Prisma,
} from '@prisma/client';

@Injectable()
export class SemesterService {
  constructor(private prisma: PrismaService) {}

  async createSemester(data: Prisma.SemesterCreateInput): Promise<Semester> {
    return this.prisma.semester.create({ data });
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

  async updateSemester(where: Prisma.SemesterWhereUniqueInput, data: Prisma.SemesterUpdateInput): Promise<Semester & { classes: Class[] } | null> {
    const semester = await this.prisma.semester.findUnique({ where });

    if (!semester || semester.deletedAt) {
      return null;
    }

    return this.prisma.semester.update({
      data,
      where,
      include: {
        classes: true,
      },
    });
  }

  async deleteSemester(where: Prisma.SemesterWhereUniqueInput) {
    const semester = await this.prisma.semester.findUnique({ where });

    if (!semester || semester.deletedAt) {
      return null;
    }

    return this.prisma.semester.update({ data: { deletedAt: new Date() }, where });
  }

  async hardDeleteSemester(where: Prisma.SemesterWhereUniqueInput) {
    const semester = await this.prisma.semester.findUnique({ where });

    if (!semester || semester.deletedAt) {
      return null;
    }

    return this.prisma.semester.delete({ where });
  }
}
