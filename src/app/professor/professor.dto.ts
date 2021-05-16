import { IsEmail, IsNotEmpty, IsInt, IsNumberString, IsOptional, IsString, IsUUID, MaxLength, ValidateIf,  } from 'class-validator';
import { Type } from 'class-transformer';
import { Class, ProfessorTccOnClass } from '@prisma/client';

export class CreateProfessorAdvisorDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorId?: string | undefined;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string;
}

export class CreateProfessorTccDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorId?: string | undefined;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  name: string | undefined;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string | undefined;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string | undefined;

  @ValidateIf(o => !o.professorId)
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string | undefined;
}

export class FindByIdParam {
  /**
   * An uuid that identifies an entity
   * @example 'f98dacd1-1941-4a12-b46c-b3e5b652ba7b'
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

export class FindByEnrollmentCodeParam {
  /**
   * @example '071859745'
   */
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string;
}

export class FindAllParams {
  /**
   * @example '0'
   */
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  skip?: number;

  /**
   * @example '100'
   */
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  take?: number;
}

export class UpdateProfessorDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber?: string | undefined;
}

class ProfessorAdvisorDto {
  id: string;
  professorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

class ProfessorTccDto {
  id: string;
  professorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  classes?: (ProfessorTccOnClass & { class: Class; })[];
}

export class ProfessorResponseDto {
  id: string;
  name: string;
  enrollmentCode: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userId: string;
  professorTcc?: ProfessorTccDto;
  professorAdvisor?: ProfessorAdvisorDto;
}
