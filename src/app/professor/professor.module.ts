import { Module } from '@nestjs/common';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  imports: [],
  controllers: [ProfessorController],
  providers: [PrismaService, ProfessorService],
})
export class ProfessorModule {}
