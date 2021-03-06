import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Class,
  Semester,
  Prisma,
} from '@prisma/client';
import { FileDto } from '../project/project.dto';

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
          where: {
            deletedAt: null,
          },
        },
        students: {
          include: {
            student: true,
          },
          where: {
            deletedAt: null,
          },
        },
        semester: true,
        files: {
          where: {
            deletedAt: null,
          },
        },
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

  async classFile(where: Prisma.ClassFileWhereUniqueInput) {
    const file = await this.prisma.classFile.findUnique({
      where,
      include: {
        class: {
          include: {
            professors: true,
          },
        },
      },
    });

    if (!file || file.deletedAt) {
      return null;
    }

    return file;
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
        professors: {
          where: {
            deletedAt: null,
          },
        },
        students: {
          where: {
            deletedAt: null,
          },
        },
        semester: true,
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async updateClassFiles({ files, where }: {
    files: FileDto[];
    where: Prisma.ClassWhereUniqueInput & { professorTccId?: string; };
  }) {
    const { professorTccId } = where;
    delete where.professorTccId;

    const classroom = await this.prisma.class.findUnique({
      where,
      include: {
        professors: {
          where: {
            professorTccId,
          },
        },
      },
    });

    if (!classroom || classroom.deletedAt || (professorTccId && !classroom.professors.length)) {
      return null;
    }

    return this.prisma.class.update({
      data: {
        files: {
          createMany: {
            data: files,
          },
        },
      },
      where,
      include: {
        professors: {
          where: {
            deletedAt: null,
          },
        },
        students: {
          where: {
            deletedAt: null,
          },
        },
        semester: true,
        files: {
          where: {
            deletedAt: null,
          },
        },
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
    const poc = await this.prisma.professorTccOnClass.findFirst({ where: { classId, professorTccId, deletedAt: null } });

    if (!poc || poc.deletedAt) {
      return null;
    }

    return this.prisma.professorTccOnClass.update({ data: { deletedAt: new Date() }, where: { id: poc.id } });
  }

  async deleteStudentOnClass(classId: string, studentId: string) {
    const soc = await this.prisma.studentOnClass.findFirst({ where: { classId, studentId, deletedAt: null } });

    if (!soc || soc.deletedAt) {
      return null;
    }

    return this.prisma.studentOnClass.update({ data: { deletedAt: new Date() }, where: { id: soc.id } });
  }

  async deleteClassFile(where: Prisma.ClassFileWhereUniqueInput) {
    const file = await this.prisma.classFile.findUnique({ where });

    if (!file || file.deletedAt) {
      return null;
    }

    return this.prisma.classFile.update({
      data: {
        deletedAt: new Date(),
      },
      where,
    });
  }
}
