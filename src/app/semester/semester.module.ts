import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';

@Module({
  imports: [],
  controllers: [SemesterController],
  providers: [PrismaService, SemesterService],
})
export class SemesterModule {}
