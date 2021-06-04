import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Register,
  Prisma,
} from '@prisma/client';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaService) {}

  async createRegister(data: Prisma.RegisterCreateInput): Promise<Register> {
    return this.prisma.register.create({ data });
  }

  async register(where: Prisma.RegisterWhereUniqueInput) {
    const register = await this.prisma.register.findUnique({
      where,
    });

    if (!register || register.deletedAt) {
      return null;
    }

    return register;
  }

  async registers({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RegisterWhereUniqueInput;
    where?: Prisma.RegisterWhereInput;
    orderBy?: Prisma.RegisterOrderByInput;
  }): Promise<Register[]> {
    return this.prisma.register.findMany({ skip, take, cursor, where: { ...where, deletedAt: null, }, orderBy });
  }

  async updateRegister(where: Prisma.RegisterWhereUniqueInput, data: Prisma.RegisterUpdateInput): Promise<Register | null> {
    const register = await this.prisma.register.findUnique({ where });

    if (!register || register.deletedAt) {
      return null;
    }

    return this.prisma.register.update({ data, where });
  }

  async deleteRegister(where: Prisma.RegisterWhereUniqueInput) {
    const register = await this.prisma.register.findUnique({ where });

    if (!register || register.deletedAt) {
      return null;
    }

    return this.prisma.register.update({ data: { deletedAt: new Date() }, where });
  }
}
