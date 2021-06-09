import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Class,
  Semester,
  Prisma,
} from '@prisma/client';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(data: Prisma.ClassCreateInput): Promise<Class & { semester: Semester }> {
    return this.prisma.class.create({ data, include: { semester: true } });
  }

  async createProfessorTccOnClass(data: Prisma.ProfessorTccOnClassCreateInput) {
    return this.prisma.professorTccOnClass.create({ data, include: { professorTcc: true, class: true } });
  }

  async createStudentOnClass(data: Prisma.StudentOnClassCreateInput) {
    return this.prisma.studentOnClass.create({ data, include: { student: true, class: true } });
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
        students: {
          include: {
            student: true,
          },
        },
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
        // exams: true,
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

  async studentOnclass(where: Prisma.StudentOnClassWhereUniqueInput) {
    const soc = await this.prisma.studentOnClass.findUnique({
      where,
      include: {
        class: true,
        student: true,
        professorReports: true,
        // studentReports: true,
      },
    });

    if (!soc || soc.deletedAt) {
      return null;
    }

    return soc;
  }

  async firstStudentOnclass(where: Prisma.StudentOnClassWhereInput) {
    const soc = await this.prisma.studentOnClass.findFirst({
      where,
      include: {
        class: true,
        student: true,
      },
    });

    if (!soc || soc.deletedAt) {
      return null;
    }

    return soc;
  }

  async checkClass(where: Prisma.ClassWhereUniqueInput) {
    return await this.prisma.class.findUnique({ where }) !== null;
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

  async deleteProfessorTccOnClass(classId: string, professorTccId: string) {
    const poc = await this.prisma.professorTccOnClass.findFirst({ where: { classId, professorTccId } });

    if (!poc || poc.deletedAt) {
      return null;
    }

    return this.prisma.professorTccOnClass.update({ data: { deletedAt: new Date() }, where: { id: poc.id } });
  }

  async deleteStudentOnClass(classId: string, studentId: string) {
    const soc = await this.prisma.studentOnClass.findFirst({ where: { classId, studentId } });

    if (!soc || soc.deletedAt) {
      return null;
    }

    return this.prisma.studentOnClass.update({ data: { deletedAt: new Date() }, where: { id: soc.id } });
  }
}
