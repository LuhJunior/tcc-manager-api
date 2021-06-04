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
  ConflictException,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import {
  CreateClassDto,
  ClassResponseDto,
  CreateSemesterDto,
  SemesterResponseDto,
  CreateProfessorOnClassDto,
  ProfessorTccOnClassResponseDto,
} from './class.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/auth.interface';
import { ClassService } from './class.service';
import { Semester } from '.prisma/client';
import { ProfessorService } from '../professor/professor.service';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly professorService: ProfessorService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Post()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  @ApiConflictResponse({ description: 'Class already registered.' })
  async createClass(
    @Body() { code, semesterId }: CreateClassDto,
  ): Promise<ClassResponseDto> {
    if (!await this.classService.semester({ id: semesterId })) {
      throw new NotFoundException('Semester not found.');
    }

    if (await this.classService.checkClass({ code })) {
      throw new ConflictException('Class already registered');
    }

    return this.classService.createClass({
      code,
      semester: {
        connect: {
          id: semesterId,
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Post('/professor')
  @ApiNotFoundResponse({ description: 'Class not found.' })
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiConflictResponse({ description: 'Professor already registered in the class.' })
  async createProfessorTccOnClass(
    @Body() { professorId, classId }: CreateProfessorOnClassDto,
  ): Promise<ProfessorTccOnClassResponseDto> {
    if (!await this.classService.class({ id: classId })) {
      throw new NotFoundException('Class not found.');
    }

    const professor = await this.professorService.professor({ id: professorId });

    if (!professor || !professor.professorTcc) {
      throw new NotFoundException('Professor not found.');
    }

    if (await this.classService.firstProfessorTccOnclass({ professorTccId: professor.professorTcc.id, classId })) {
      throw new ConflictException('Professor already registered in the class.');
    }

    return this.classService.createProfessorTccOnClass({
      class: {
        connect: {
          id: classId,
        },
      },
      professorTcc: {
        connect: {
          id: professor.professorTcc.id
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Post('semester')
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  @ApiConflictResponse({ description: 'Semester already registered.' })
  @ApiConflictResponse({ description: 'Received period has a conflict with one registred semester.' })
  @ApiBadRequestResponse({ description: 'Semester can\'t have less than 100 days.' })
  @ApiBadRequestResponse({ description: 'Semester start period can\'t be greater than end period.' })
  async createSemester(
    @Body() { code, startPeriod, endPeriod }: CreateSemesterDto,
  ): Promise<SemesterResponseDto> {
    const conflict = await this.classService.conflictPeriodSemester(startPeriod, endPeriod);
    if (conflict) {
      throw new ConflictException(conflict, 'Received period has a conflict with one registred semester.');
    }

    if (startPeriod > endPeriod) {
      throw new BadRequestException('Semester start period can\'t be greater than end period.');
    }

    // 100 days * 24 hours * 60 minutes * 60 seconds * 1000 miliseconds
    if (startPeriod.getTime() + 8640000000 > endPeriod.getTime()) {
      throw new BadRequestException('Semester can\'t have less than 100 days.');
    }

    if (await this.classService.checkSemester({ code })) {
      throw new ConflictException('Semester already registered.');
    }

    return this.classService.createSemester({
      code,
      startPeriod,
      endPeriod,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get('semester/current')
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  async findCurrentSemeter(): Promise<CreateClassDto> {
    const semester = await this.classService.currentSemester();

    if (!semester) {
      throw new NotFoundException('Semester not found.');
    }

    return semester;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get()
  async findAllClass(
    @Query() { skip, take }: FindAllParams,
  ): Promise<ClassResponseDto[]> {
    return (
      await this.classService.classes({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      })).map(({ professors, ...classroom }) => ({ ...classroom, professors: professors.map(professor => ({ ...professor.professorTcc.professor })) })
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get('semester')
  async findAllSemesters(
    @Query() { skip, take }: FindAllParams,
  ): Promise<SemesterResponseDto[]> {
    return this.classService.semesters({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Class not found.' })
  async findClassById(
    @Param() { id }: FindByIdParam
  ): Promise<ClassResponseDto> {
    const classroom = await this.classService.class({ id });

    if (!classroom) {
      throw new NotFoundException('Class not found.');
    }

    return { ...classroom, professors: classroom.professors.map(professor => ({ ...professor.professorTcc.professor })) };
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Class not found.' })
  async deleteClass(
    @Param() { id }: FindByIdParam
  ): Promise<ClassResponseDto> {
    const classroom = await this.classService.deleteClass({ id });

    if (!classroom) {
      throw new NotFoundException('Class not found.',);
    }

    return classroom;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete(':id/semester/hard')
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  async hardDeleteSemester(
    @Param() { id }: FindByIdParam
  ): Promise<SemesterResponseDto> {
    const semester = await this.classService.hardDeleteSemester({ id });

    if (!semester) {
      throw new NotFoundException('Semester not found.',);
    }

    return semester;
  }
}