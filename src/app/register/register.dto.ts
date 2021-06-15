import { ApiProperty } from '@nestjs/swagger';
import { RegisterType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStudentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  classId: string;
}


export class FilterByType {
  /**
   * @example 'STUDENT'
   */
  @ApiProperty({ enum: RegisterType })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(RegisterType)
  type?: RegisterType;
}

export class RegisterResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  name: string;
  enrollmentCode: string;
  email: string;
  @ApiProperty({ enum: RegisterType })
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
