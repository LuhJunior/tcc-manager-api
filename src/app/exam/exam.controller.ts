import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiBearerAuth, ApiBadRequestResponse } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto, UpdateExamDto, ExamResponseDto, FindAllExamsQuery, CreatePostDto, UpdatePostDto, PostResponseDto, ExamWithPostResponseDto } from './exam.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/auth.interface';
import { ClassService } from '../class/class.service';

@ApiTags('Exam')
@Controller('exam')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly classService: ClassService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ProfessorTcc)
  @Post('class/:id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'ProfessorTccOnClass not found.' })
  @ApiBadRequestResponse({ description: 'Deadline can\'t be before today.' })
  async createExam(
    @Param() { id: classId }: FindByIdParam,
    @Body() { title, description, deadlineAt }: CreateExamDto,
    @Request() req: RequestWithUser,
  ): Promise<ExamResponseDto> {
    if (deadlineAt < new Date()) {
      throw new BadRequestException('Deadline can\'t be before today.');
    }

    const professorTccId = req.user.professor?.professorTcc?.id;

    const poc = await this.classService.firstProfessorTccOnclass({ classId, professorTccId });

    if (!poc) {
      throw new NotFoundException('ProfessorTccOnClass not found.');
    }

    return this.examService.createExam({ title, description, deadlineAt, professorTccOnClass: { connect: { id: poc.id } } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Exam not found.' })
  async createPost(
    @Param() { id }: FindByIdParam,
    @Body() { title, content, files }: CreatePostDto,
    @Request() req: RequestWithUser,
  ): Promise<PostResponseDto> {
    const exam = await this.examService.exam({ id });

    if (!exam) {
      throw new NotFoundException('Exam not found.');
    }

    return {
      ...await this.examService.createPost({
        title,
        content,
        fileUrl: files?.join('|'),
        exam: {
          connect: {
            id,
          },
        },
        student: {
          connect: {
            id: req.user.student.id,
          },
        },
      }),
      files,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Professor, Role.Student)
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Exam not found.' })
  async findExamById(
    @Param() { id }: FindByIdParam
  ): Promise<ExamWithPostResponseDto> {
    const exam = await this.examService.exam({ id });

    if (!exam) {
      throw new NotFoundException('Exam not found.');
    }

    return {
      ...exam,
      posts: exam.posts.map(post => ({ ...post, files: post.fileUrl.split('|') })),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ProfessorTcc, Role.Student)
  @Get()
  async findAllProfessorExams(
    @Query() { skip, take, classId }: FindAllParams & FindAllExamsQuery,
    @Request() req: RequestWithUser,
  ): Promise<ExamWithPostResponseDto[]> {
    const studentId = req.user.student?.id;
    const professorTccId = req.user.professor?.professorTcc?.id;

    const exams = await this.examService.exams({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        professorTccOnClass: {
          classId,
          class: studentId ? {
            students: {
              some: {
                studentId: studentId,
              },
            },
          } : undefined,
          professorTccId,
        },
      },
    });

    return exams.map(exam => ({
      ...exam,
      posts: exam.posts.map(post => ({ ...post, files: post.fileUrl.split('|') })),
    }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ProfessorTcc)
  @Patch(':id')
  @ApiNotFoundResponse({ description: 'Exam not found.' })
  async updateExam(
    @Param() { id }: FindByIdParam,
    @Body() { title, description, deadlineAt }: UpdateExamDto,
  ): Promise<ExamWithPostResponseDto> {
    const exam = await this.examService.updateExam({ id }, {
      title,
      description,
      deadlineAt,
    });

    if (!exam) {
      throw new NotFoundException('Exam not found.');
    }

    return {
      ...exam,
      posts: exam.posts.map(post => ({ ...post, files: post.fileUrl.split('|') })),
    };;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Student)
  @Patch('post/:id')
  @ApiNotFoundResponse({ description: 'Exam not found.' })
  async updatePost(
    @Param() { id }: FindByIdParam,
    @Body() { title, content, files }: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.examService.updatePost({ id }, {
      title,
      content,
      fileUrl: files.join('|'),
    });

    if (!post) {
      throw new NotFoundException('Exam not found.');
    }

    return { ...post, files: post.fileUrl.split('|') };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ProfessorTcc)
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Exam not found.' })
  async deleteUser(
    @Param() { id }: FindByIdParam
  ): Promise<ExamResponseDto> {
    const exam = await this.examService.deleteExam({ id });

    if (!exam) {
      throw new NotFoundException('Exam not found.');
    }

    return exam;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Student)
  @Delete('post/:id')
  @ApiNotFoundResponse({ description: 'Post not found.' })
  async deletePost(
    @Param() { id }: FindByIdParam
  ): Promise<PostResponseDto> {
    const post = await this.examService.deletePost({ id });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return { ...post, files: post.fileUrl.split('|') };
  }
}