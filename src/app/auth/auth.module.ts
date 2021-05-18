import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { ProfessorService } from '../professor/professor.service';
import { StudentService } from '../student/student.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: "Segredo",
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, LocalStrategy, JwtStrategy, UserService, StudentService, ProfessorService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
