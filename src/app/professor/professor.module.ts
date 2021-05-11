import { Module } from '@nestjs/common';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';


@Module({
  imports: [UserModule],
  controllers: [ProfessorController],
  providers: [PrismaService, ProfessorService, UserService],
})
export class ProfessorModule {}
