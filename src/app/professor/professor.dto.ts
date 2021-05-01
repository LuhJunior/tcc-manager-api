import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';

export class CreateProfessorAdvisorDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorId?: string | undefined;

  @ValidateIf(o => o.professorId === undefined)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf(o => o.professorId === undefined)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ValidateIf(o => o.professorId === undefined)
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string;

  @ValidateIf(o => o.professorId === undefined)
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

  @ValidateIf(o => o.professorId === undefined)
  @IsNotEmpty()
  @IsString()
  name: string | undefined;

  @ValidateIf(o => o.professorId === undefined)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string | undefined;

  @ValidateIf(o => o.professorId === undefined)
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string | undefined;

  @ValidateIf(o => o.professorId === undefined)
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string | undefined;
}

export class FindByIdParam {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

export class FindByEnrollmentCodeParam {
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string;
}

export class FindAllParams {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
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

export class ProfessorResponseDto {
  id: string;
  name: string;
  enrollmentCode: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
