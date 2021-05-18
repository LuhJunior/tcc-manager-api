import { Injectable } from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
    return this.prisma.student.create({ data });
  }

  async student(where: Prisma.StudentWhereUniqueInput): Promise<Student | null> {
    const student = await this.prisma.student.findUnique({
      where,
      include: {
        applications: true,
        user: {
          select: { id: true, type: true, createdAt: true, updatedAt: true, deletedAt: true },
        },
      },
    });


    if (!student || student.deletedAt) {
      return null;
    }

    return student;
  }

  async students({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StudentWhereUniqueInput;
    where?: Prisma.StudentWhereInput;
    orderBy?: Prisma.StudentOrderByInput;
  }): Promise<Student[]> {
    return this.prisma.student.findMany({ skip, take, cursor, where: { ...where, deletedAt: null, }, orderBy });
  }

  // async updateUser(where: Prisma.UserWhereUniqueInput, password: string): Promise<Student | null> {
  //   const user = await this.prisma.user.findUnique({ where });

  //   if (!user || user.deletedAt) {
  //     return null;
  //   }

  //   return this.prisma.user.update({ data: { password: await bcrypt.hash(password, 123456) }, where });
  // }

  // async deleteUser(where: Prisma.UserWhereUniqueInput) {
  //   const user = await this.prisma.user.findUnique({ where });

  //   if (!user || user.deletedAt) {
  //     return null;
  //   }

  //   return this.prisma.user.update({ data: { deletedAt: new Date() }, where });
  // }
}
