import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus, ProjectStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ProfessorResponseDto } from '../professor/professor.dto';
import { StudentResponseDto } from '../student/student.dto';

export class FileDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id?: string;

  /**
   * Title of the file
   * @example 'A file'
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  /**
   * Description of the file
   * @example 'Some article'
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Url of the file on the cloud
   * @example 'www.url.com/file'
   */
  @IsNotEmpty()
  @IsString()
  fileUrl: string;
}

export class CreateProjectDto {
  /**
   * @example 'A beautiful project title'
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  /**
   * @example 'A project description'
   */
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class CreateProjectApplicationDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  projectId: string;
}

export class FindByIdParam {
  /**
   * @example 'd437d6e4-99fe-432f-81d9-0284af9a571f'
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
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

export class UpdateProjectDto {
  /**
   * @example 'A beautiful project title'
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string | undefined;

  /**
   * @example 'A project description'
   */
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string | undefined;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class UpdateProjectAddFilesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files: FileDto[];
}

export class ProjectResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  /**
   * @example 'A beautiful project title'
   */
  title: string;
  /**
   * @example 'A project description'
   */
  description: string;
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  professorAdvisorId: string;
  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class ApplicationResponseDto {
  id: string;
  studentId: string;
  projectId: string;
  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}


export class FileResponseDto extends FileDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
}


export class ProjectResponseWithProfessorDto extends ProjectResponseDto {
  professor: ProfessorResponseDto;
  files?: FileResponseDto[];
  applications?: ApplicationResponseDto[];
}

export class ProjectResponseWithProfessorAndStudentDto extends ProjectResponseWithProfessorDto {
  student: StudentResponseDto | null;
}

export class ProjectAgreementPdfResponseDto {
  /**
   * Url of the file on the cloud
   * @example 'www.url.com/file'
   */
  @IsNotEmpty()
  @IsString()
  fileUrl: string;
}
