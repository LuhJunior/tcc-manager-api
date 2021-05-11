import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  User,
  Prisma,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: { ...data, password: await bcrypt.hash(data.password, 10) } });
  }

  async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where,
      include: {
        professor: {
          include: {
            professorAdvisor: true,
            professorTcc: true,
          },
        },
        student: true,
      },
    });

    if (!user || user.deletedAt) {
      return null;
    }

    return user;
  }

  async users({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({ skip, take, cursor, where: { ...where, deletedAt: null, }, orderBy });
  }

  async updateUser(where: Prisma.UserWhereUniqueInput, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where });

    if (!user || user.deletedAt) {
      return null;
    }

    return this.prisma.user.update({ data: { password: await bcrypt.hash(password, 123456) }, where });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({ where });

    if (!user || user.deletedAt) {
      return null;
    }

    return this.prisma.user.update({ data: { deletedAt: new Date() }, where });
  }
}
