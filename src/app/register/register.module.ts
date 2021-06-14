import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { UserService } from '../user/user.service';
import { ClassService } from '../class/class.service';

@Module({
  imports: [],
  controllers: [RegisterController],
  providers: [PrismaService, RegisterService, UserService, ClassService],
})
export class RegisterModule {}
