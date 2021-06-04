import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfessorService } from '../professor/professor.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService, ProfessorService],
})
export class UserModule {}
