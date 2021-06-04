import { ProfessorTccOnClass, Semester, Student, StudentOnClass } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID, ValidateIf,  } from 'class-validator';
import { ProfessorResponseDto } from '../professor/professor.dto';

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
  @IsUUID()
  semesterId?: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class CreateProfessorOnClassDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  classId?: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorId?: string;
}

// export class UpdateClassDto {
//   @IsNotEmpty()
//   @IsString()
//   code?: string;
// }

export class ClassResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example CPD15
   */
  code: string;
  students?: StudentOnClass[];
  // professors?: ProfessorTccOnClass[];
  professors?: ProfessorResponseDto[];
  semester: Semester;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class SemesterResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example 2021.1
   */
  code: string;
  startPeriod: Date;
  endPeriod: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
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
  deletedAt?: Date;
}
