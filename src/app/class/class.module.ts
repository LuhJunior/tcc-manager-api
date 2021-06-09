import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ProfessorService } from '../professor/professor.service';
import { SemesterService } from '../semester/semester.service';

@Module({
  imports: [],
  controllers: [ClassController],
  providers: [PrismaService, ClassService, SemesterService, ProfessorService],
})
export class ClassModule {}
