import { Body, Controller, Get, NotFoundException, Param, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { RequestWithUser } from '../auth/auth.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FindAllParams, FindByEnrollmentCodeParam, FindByIdParam } from '../professor/professor.dto';
import { UserService } from '../user/user.service';
import { CreateStudentDto, StudentResponseDto, StudentResponseWithApplicationsDto } from './student.dto';
import { StudentService } from './student.service';
import { SemesterService } from '../semester/semester.service';

@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService,
    private readonly semesterService: SemesterService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @ApiBearerAuth()
  async createStudent(
    @Body() studentData: CreateStudentDto,
  ): Promise<StudentResponseDto> {

    await this.userService.createUser({
      login: studentData.enrollmentCode,
      password: studentData.enrollmentCode.substr(0, 6),
      type: 'STUDENT',
    });

    return this.studentService.createStudent({
      ...studentData,
      user: {
        connect: { login: studentData.enrollmentCode },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('me')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async findAuthProfessor(@Request() req: RequestWithUser): Promise<StudentResponseWithApplicationsDto> {
    const student = await this.studentService.student({ userId: req.user.id });

    if (!student) throw new NotFoundException('Student not found.');

    return student;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async findStudentById(@Param() { id }: FindByIdParam): Promise<StudentResponseWithApplicationsDto> {
    const student = await this.studentService.student({ id });

    if (!student) throw new NotFoundException('Student not found.');

    return student;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Secretary)
  @Get('enrollmentCode/:enrollmentCode')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async findStudentByEnrollmentCode(@Param() { enrollmentCode }: FindByEnrollmentCodeParam): Promise<StudentResponseWithApplicationsDto> {
    const student = await this.studentService.student({ enrollmentCode });

    if (!student) throw new NotFoundException('Student not found.');

    return student;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get()
  @ApiBearerAuth()
  async findAllStudents(
    @Query() { skip, take } : FindAllParams,
  ): Promise<StudentResponseDto[]> {
    return this.studentService.students({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary, Role.ProfessorTcc)
  @Get('create/class')
  @ApiBearerAuth()
  async findAllNoClassStudents(
    @Query() { skip, take } : FindAllParams,
  ): Promise<StudentResponseDto[]> {
    const cs = await this.semesterService.currentSemester();

    return this.studentService.students({
      skip,
      take,
      where: {
        classes: {
          every: {
            NOT: {
              OR: {
                deletedAt: null,
                class: {
                  semesterId: cs.id,
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
