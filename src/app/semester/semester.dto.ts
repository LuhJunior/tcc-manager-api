import { Class } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsOptional, ValidateIf } from 'class-validator';

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

export class UpdateSemesterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  code?: string;

  @ValidateIf(o => !o.endPeriod)
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startPeriod?: Date;

  @ValidateIf(o => !o.startPeriod)
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endPeriod?: Date;
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

export class SemesterWithClassResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example 2021.1
   */
  code: string;
  classes: Class[];
  startPeriod: Date;
  endPeriod: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
