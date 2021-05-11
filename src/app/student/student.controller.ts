import { Student } from '.prisma/client';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { FindAllParams, FindByEnrollmentCodeParam, FindByIdParam } from '../professor/professor.dto';
import { UserService } from '../user/user.service';
import { CreateStudentDto } from './student.dto';
import { StudentService } from './student.service';

@Controller()
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}

  @Post('student')
  async createStudent(
    @Body() studentData: CreateStudentDto,
  ): Promise<Student> {

    await this.userService.createUser({
      login: studentData.enrollmentCode,
      password: studentData.enrollmentCode.substr(0, 6),
    });

    return this.studentService.createStudent({
      ...studentData,
      user: {
        connect: { login: studentData.enrollmentCode },
      },
    });
  }

  @Get('student/:id')
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async findStudentById(@Param() { id }: FindByIdParam): Promise<Student> {
    const student = await this.studentService.student({ id });

    if (!student) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return student;
  }

  @Get('student/enrollmentCode/:enrollmentCode')
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async findStudentByEnrollmentCode(@Param() { enrollmentCode }: FindByEnrollmentCodeParam): Promise<Student> {
    const student = await this.studentService.student({ enrollmentCode });

    if (!student) {
      throw new HttpException('Student not found.', HttpStatus.NOT_FOUND);
    }

    return student;
  }

  @Get('student')
  async findAllProfessors(
    @Query() { skip, take } : FindAllParams,
  ): Promise<Student[]> {
    return this.studentService.students({ skip, take, orderBy: { createdAt: 'desc' } });
  }
}
