import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProfessorService } from '../professor/professor.service';
import { PrismaService } from '../prisma/prisma.service';
import { DataUploadService } from '../data.upload/data.upload.service';
import { PdfService } from '../pdf/pdf.service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [PrismaService, ProjectService, ProfessorService, DataUploadService, PdfService],
})
export class ProjectModule {}
