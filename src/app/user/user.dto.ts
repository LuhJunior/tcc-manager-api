import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProfessorResponseDto } from '../professor/professor.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}

export class UpdatePasswordDto {
  /**
   * @example 'A large complex string'
   */
  @IsNotEmpty()
  @IsString()
  password?: string;
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
  professor?: ProfessorResponseDto;
  @ApiProperty({ enum: UserType })
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
