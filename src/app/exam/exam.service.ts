import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
} from '@prisma/client';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async createExam(data: Prisma.ExamCreateInput) {
    return this.prisma.exam.create({
      data,
    });
  }

  async createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({
      data,
      include: {
        files: true,
      },
    });
  }

  async exam(where: Prisma.ExamWhereUniqueInput) {
    const exam = await this.prisma.exam.findUnique({
      where,
      include: {
        posts: {
          include: {
            student: true,
            files: {
              where: {
                deletedAt: null,
              },
            },
          },
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!exam || exam.deletedAt) {
      return null;
    }

    return exam;
  }

  async post(where: Prisma.PostWhereUniqueInput) {
    const post = await this.prisma.post.findUnique({
      where,
      include: {
        student: true,
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!post || post.deletedAt) {
      return null;
    }

    return post;
  }

  async exams({ skip, take, cursor, where, orderBy }: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ExamWhereUniqueInput;
    where?: Prisma.ExamWhereInput;
    orderBy?: Prisma.ExamOrderByInput;
  }) {
    return this.prisma.exam.findMany({
      skip,
      take,
      cursor,
      where: {
        ...where,
        deletedAt: null,
      },
      orderBy,
      include: {
        posts: {
          include: {
            student: true,
            files: {
              where: {
                deletedAt: null,
              },
            },
          },
          where: {
            deletedAt: null,
          },
        },
        professorTccOnClass: {
          include: {
            class: true,
          },
        },
      },
    });
  }

  async updateExam(where: Prisma.ExamWhereUniqueInput, data: Prisma.ExamUpdateInput) {
    const exam = await this.prisma.exam.findUnique({ where });

    if (!exam || exam.deletedAt) {
      return null;
    }

    return this.prisma.exam.update({
      data,
      where,
      include: {
        posts: {
          include: {
            student: true,
            files: {
              where: {
                deletedAt: null,
              },
            },
          },
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async updatePost(where: Prisma.PostWhereUniqueInput, data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({
      data,
      include: {
        student: true,
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
      where,
    });
  }

  async deleteExam(where: Prisma.ExamWhereUniqueInput) {
    const exam = await this.prisma.exam.findUnique({ where });

    if (!exam || exam.deletedAt) {
      return null;
    }

    return this.prisma.exam.update({
      data: {
        deletedAt: new Date(),
      },
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput) {
    const post = await this.prisma.post.findUnique({ where });

    if (!post || post.deletedAt) {
      return null;
    }

    return this.prisma.post.update({
      data: {
        deletedAt: new Date(),
      },
      include: {
        files: {
          where: {
            deletedAt: null,
          },
        },
      },
      where,
    });
  }
}
