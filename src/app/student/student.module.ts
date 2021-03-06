import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { SemesterService } from '../semester/semester.service';

@Module({
  controllers: [StudentController],
  providers: [PrismaService, StudentService, UserService, SemesterService],
})
export class StudentModule {}
