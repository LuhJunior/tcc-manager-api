import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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
