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
    return this.prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
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
  }

  async user(where: Prisma.UserWhereUniqueInput) {
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

  async checkUser(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUnique({ where }) !== null;
  }

  async users({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where: {
        ...where,
        deletedAt: null,
      },
      orderBy,
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
  }

  async updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where });

    if (!user || user.deletedAt) {
      return null;
    }

    return this.prisma.user.update({
      data: {
        ...data,
        password: data.password ? await bcrypt.hash(data.password.toString(), 10) : undefined,
      },
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
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({ where });

    if (!user || user.deletedAt) {
      return null;
    }

    return this.prisma.user.update({
      data: {
        professor: ['PROFESSOR', 'COORDINATOR'].includes(user.type) ? {
          update: {
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
            deletedAt: new Date(),
          },
        } : undefined,
        student: user.type === 'STUDENT' ? {
          update: {
            deletedAt: new Date(),
          },
        } : undefined,
        deletedAt: new Date(),
      },
      where,
    });
  }
}
