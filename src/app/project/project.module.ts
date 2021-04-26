import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProfessorService } from '../professor/professor.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [PrismaService, ProjectService, ProfessorService],
})
export class ProjectModule {}
