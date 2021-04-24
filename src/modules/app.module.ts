import { Module } from '@nestjs/common';
import { ProfessorController } from '../controllers/professor.controller';
import { ProjectController } from '../controllers/project.controller';
import { PrismaService } from '../services/prisma.service';
import { ProfessorService } from '../services/professor.service';
import { ProjectService } from '../services/project.service';

@Module({
  imports: [],
  controllers: [ProfessorController, ProjectController],
  providers: [PrismaService, ProfessorService, ProjectService],
})
export class AppModule {}
