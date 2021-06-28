import { ApiProperty } from '@nestjs/swagger';
import { StudentOnClassStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ProfessorResponseDto } from '../professor/professor.dto';
import { SemesterResponseDto } from '../semester/semester.dto';
import { StudentResponseDto } from '../student/student.dto';

export class CreateSemesterDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startPeriod: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endPeriod: Date;
}

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class CreateProfessorOnClassDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorId: string;
}

export class CreateStudentOnClassDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  studentId: string;
}

export class UpdateClassDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class ClassResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example CPD15
   */
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class StudentOnClassResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
   studentId: string;
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  classId: string;
  @ApiProperty({ enum: StudentOnClassStatus })
  status: StudentOnClassStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class ProfessorTccOnClassResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  professorTccId: string;
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  classId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class ClassResponseWithSemesterDto extends ClassResponseDto {
  students?: StudentResponseDto[];
  professors?: ProfessorResponseDto[];
  semester: SemesterResponseDto;
}
