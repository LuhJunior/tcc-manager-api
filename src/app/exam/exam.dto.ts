import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ClassResponseDto } from '../class/class.dto';
import { FileDto, FileResponseDto } from '../project/project.dto';
import { StudentResponseDto } from '../student/student.dto';

export class CreateExamDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  deadlineAt: Date;
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class CreateExamParam {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  classId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorTccId: string;
}

export class FindAllExamsQuery {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  classId: string | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  student: boolean | undefined;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professor: boolean | undefined;
}


export class UpdateExamDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  deadlineAt?: Date;
}


export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class ExamResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  title: string;
  description: string;
  deadlineAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class ExamWithPostResponseDto extends ExamResponseDto {
  professorTccOnClass?: {
    class?: ClassResponseDto;
  };
  posts: PostWithStudentResponseDto[];
}

export class PostResponseDto {
  /**
   * @example 'a822ec2a-5d28-4b6f-8406-54f3a0be2717'
   */
  id: string;
  title: string;
  content: string;
  files: FileResponseDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class PostWithStudentResponseDto extends PostResponseDto {
  student: StudentResponseDto;
}
