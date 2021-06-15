import { ApiProperty } from '@nestjs/swagger';
import { Student, UserType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { ProfessorResponseWithAdvisorAndTccDto } from '../professor/professor.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  @ApiProperty({ enum: UserType })
  type: UserType;

  @ValidateIf(o => o.type === UserType.PROFESSOR)
  @IsNotEmpty()
  @IsString()
  name: string | undefined;

  @ValidateIf(o => o.type === UserType.PROFESSOR)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string | undefined;

  @ValidateIf(o => o.type === UserType.PROFESSOR)
  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string | undefined;

  @ValidateIf(o => o.type === UserType.PROFESSOR)
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string | undefined;
}

export class UpdateUserQuery {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserType)
  @ApiProperty({ enum: UserType })
  type: string | undefined;
}

export class UpdateUserDto {
  /**
   * @example 'A large complex string'
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string | undefined;
}

export class UserResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example 'User's Login'
   */
  login: string;
  student?: Student;
  professor?: ProfessorResponseWithAdvisorAndTccDto;
  @ApiProperty({ enum: UserType })
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
