import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { ClassService } from '../class/class.service';

@Module({
  imports: [],
  controllers: [ExamController],
  providers: [PrismaService, ExamService, ClassService],
})
export class ExamModule {}
