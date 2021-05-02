import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class FileDto {
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
  @IsString()
  description: string;

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
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorId: string;

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
  deletedAt: Date;
}