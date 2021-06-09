import { IsEmail, IsNotEmpty, IsInt, IsNumberString, IsOptional, IsString, IsUUID, MaxLength, ValidateIf,  } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string;
}

// export class FindByIdParam {
//   /**
//    * An uuid that identifies an entity
//    * @example 'f98dacd1-1941-4a12-b46c-b3e5b652ba7b'
//    */
//   @IsNotEmpty()
//   @IsString()
//   @IsUUID()
//   id: string;
// }

// export class FindByEnrollmentCodeParam {
//   /**
//    * @example '071859745'
//    */
//   @IsNotEmpty()
//   @IsString()
//   @IsNumberString({ no_symbols: true })
//   @MaxLength(15)
//   enrollmentCode: string;
// }

// export class FindAllParams {
//   /**
//    * @example '0'
//    */
//   @IsOptional()
//   @IsNotEmpty()
//   @IsInt()
//   @Type(() => Number)
//   skip?: number;

//   /**
//    * @example '100'
//    */
//   @IsOptional()
//   @IsNotEmpty()
//   @IsInt()
//   @Type(() => Number)
//   take?: number;
// }

// export class UpdateProfessorDto {
//   @IsOptional()
//   @IsNotEmpty()
//   @IsString()
//   name?: string | undefined;

//   @IsOptional()
//   @IsNotEmpty()
//   @IsString()
//   @IsEmail()
//   email?: string | undefined;

//   @IsOptional()
//   @IsNotEmpty()
//   @IsString()
//   @IsNumberString({ no_symbols: true })
//   @MaxLength(15)
//   enrollmentCode?: string | undefined;

//   @IsOptional()
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(15)
//   phoneNumber?: string | undefined;
// }

export class StudentResponseDto {
  id: string;
  name: string;
  enrollmentCode: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

class ApplicationDto {
  id: string;
  studentId: string;
  projectId: string;
  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class StudentResponseWithApplicationsDto extends StudentResponseDto {
  applications?: ApplicationDto[];
}
