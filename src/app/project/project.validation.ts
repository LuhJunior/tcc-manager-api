import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class FileDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;
}

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorAdvisorId?: string | undefined;

  @IsNotEmpty()
  @IsString()
  title: string;

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
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;
}

export class UpdateProjectFieldsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string | undefined;
}
