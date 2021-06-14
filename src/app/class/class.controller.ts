import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  Request,
  NotFoundException,
  ConflictException,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiConflictResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateClassDto,
  CreateProfessorOnClassDto,
  ProfessorTccOnClassResponseDto,
  UpdateClassDto,
  ClassResponseWithSemesterDto,
  CreateStudentOnClassDto,
  StudentOnClassResponseDto,
  ClassResponseDto,
} from './class.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClassService } from './class.service';
import { ProfessorService } from '../professor/professor.service';
import { SemesterService } from '../semester/semester.service';
import { StudentService } from '../student/student.service';
import { RequestWithUser } from '../auth/auth.interface';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly semesterService: SemesterService,
    private readonly professorService: ProfessorService,
    private readonly studentService: StudentService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Post('semester/:id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  @ApiConflictResponse({ description: 'Class already registered.' })
  async createClass(
    @Param() { id }: FindByIdParam,
    @Body() { code }: CreateClassDto,
  ): Promise<ClassResponseWithSemesterDto> {
    if (!await this.semesterService.semester({ id })) {
      throw new NotFoundException('Semester not found.');
    }

    if (await this.classService.checkClass({ code })) {
      throw new ConflictException('Class already registered');
    }

    return {
      ...await this.classService.createClass({
        code,
        semester: {
          connect: {
            id,
          },
        },
      }),
      professors: [],
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Post(':id/professor')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Class not found.' })
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiConflictResponse({ description: 'Professor already registered in the class.' })
  async createProfessorTccOnClass(
    @Param() { id }: FindByIdParam,
    @Body() { professorId }: CreateProfessorOnClassDto,
  ): Promise<ProfessorTccOnClassResponseDto> {
    if (!await this.classService.class({ id })) {
      throw new NotFoundException('Class not found.');
    }

    const professor = await this.professorService.professor({ id: professorId });

    if (!professor || !professor.professorTcc) {
      throw new NotFoundException('Professor not found.');
    }

    if (await this.classService.firstProfessorTccOnclass({ professorTccId: professor.professorTcc.id, classId: id })) {
      throw new ConflictException('Professor already registered in the class.');
    }

    return this.classService.createProfessorTccOnClass({
      class: {
        connect: {
          id,
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
  @Roles(Role.Admin, Role.ProfessorTcc)
  @Post(':id/student')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Class not found.' })
  @ApiNotFoundResponse({ description: 'Student not found.' })
  @ApiConflictResponse({ description: 'Student already registered in a class for this semester.' })
  async createStudentOnClass(
    @Param() { id }: FindByIdParam,
    @Body() { studentId }: CreateStudentOnClassDto,
  ): Promise<StudentOnClassResponseDto> {
    const classroom = await this.classService.class({ id });
    if (!classroom) {
      throw new NotFoundException('Class not found.');
    }

    if (!await this.studentService.student({ id: studentId })) {
      throw new NotFoundException('Student not found.');
    }

    if (await this.classService.firstStudentOnclass({ studentId, class: { semesterId: classroom.semesterId } })) {
      throw new ConflictException('Student already registered in a class for this semester.');
    }

    return this.classService.createStudentOnClass({
      class: {
        connect: {
          id,
        },
      },
      student: {
        connect: {
          id: studentId,
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get()
  @ApiBearerAuth()
  async findAllClass(
    @Query() { skip, take }: FindAllParams,
  ): Promise<ClassResponseWithSemesterDto[]> {
    return (
      await this.classService.classes({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      })).map(({ professors, ...classroom }) => ({ ...classroom, professors: professors.map(professor => professor.professorTcc.professor) })
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ProfessorTcc)
  @Get('professor')
  @ApiBearerAuth()
  async findAllProfessorClass(
    @Request() req: RequestWithUser,
    @Query() { skip, take }: FindAllParams,
  ): Promise<ClassResponseDto[]> {
    return this.classService.classes({
      skip,
      take,
      where: {
        professors: {
          some: {
            professorTccId: req.user.professor?.professorTcc.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary, Role.ProfessorTcc, Role.Student)
  @Get(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Class not found.' })
  async findClassById(
    @Param() { id }: FindByIdParam
  ): Promise<ClassResponseWithSemesterDto> {
    const classroom = await this.classService.class({ id });

    if (!classroom) {
      throw new NotFoundException('Class not found.');
    }

    return ({
      ...classroom,
      professors: classroom.professors.map(professor => professor.professorTcc.professor),
      students: classroom.students.map(student => student.student)
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Put(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Class not found.' })
  @ApiConflictResponse({ description: 'Class already registered.' })
  async updateClass(
    @Param() { id }: FindByIdParam,
    @Body() { code }: UpdateClassDto,
  ): Promise<ClassResponseWithSemesterDto> {
    const classroom = await this.classService.class({ id });

    if (!classroom) {
      throw new NotFoundException('Class not found.')
    }

    if (code === classroom.code) {
      return ({
        ...classroom,
        professors: classroom.professors.map(professor => professor.professorTcc.professor),
        students: classroom.students.map(student => student.student),
      });
    }

    if (await this.classService.checkClass({ code })) {
      throw new ConflictException('Class already registered');
    }

    return ({
      ...await this.classService.updateClass({ id }, { code }),
      professors: classroom.professors.map(professor => ({ ...professor.professorTcc.professor })),
      students: classroom.students.map(student => student.student),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Class not found.' })
  async deleteClass(
    @Param() { id }: FindByIdParam
  ): Promise<ClassResponseWithSemesterDto> {
    const classroom = await this.classService.deleteClass({ id });

    if (!classroom) {
      throw new NotFoundException('Class not found.',);
    }

    return classroom;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete('id:/professor/:professorId')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'ProfessorTccOnClass not found.' })
  async deleteProfessorTccOnClass(
    @Param() { id, professorId }: FindByIdParam & CreateProfessorOnClassDto
  ): Promise<ProfessorTccOnClassResponseDto> {
    const poc = await this.classService.deleteProfessorTccOnClass(id, professorId);

    if (!poc) {
      throw new NotFoundException('ProfessorTccOnClass not found.');
    }

    return poc;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary, Role.ProfessorTcc)
  @Delete(':id/student/:studentId')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'StudentOnClass not found.' })
  async deleteStudentOnClass(
    @Param() { id, studentId }: FindByIdParam & CreateStudentOnClassDto
  ): Promise<StudentOnClassResponseDto> {
    const soc = await this.classService.deleteStudentOnClass(id, studentId);

    if (!soc) {
      throw new NotFoundException('StudentOnClass not found.',);
    }

    return soc;
  }
}