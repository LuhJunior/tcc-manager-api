import { Controller, Request, Post, UseGuards, Get, Body, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RequestWithUser } from './auth.interface';
import { UserResponseDto } from '../user/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRegisterDto, LoginDtoRequest, LoginDtoResponse, RegisterType } from './auth.dto';
import { ProfessorService } from '../professor/professor.service';
import { StudentService } from '../student/student.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly professorService: ProfessorService,
    private readonly studentService: StudentService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser, @Body() _: LoginDtoRequest): Promise<LoginDtoResponse> {
    const { accessToken } = await this.authService.login(req.user);
    return { accessToken, userType: req.user.type };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req: RequestWithUser): UserResponseDto {
    return req.user;
  }

  @Post('register')
  async acceptProfessorAdvisor(
    @Body() register: CreateRegisterDto,
  ): Promise<CreateRegisterDto> {
    if (register.type === RegisterType.PROFESSOR) {
      delete register.type;

      const professor = await this.professorService.createProfessor({
        ...register,
        professorAdvisor: {
          create: { },
        },
      });

      return { ...professor, type: RegisterType.PROFESSOR, };
    } else if (register.type === RegisterType.STUDENT) {
      delete register.type;

      const student = await this.studentService.createStudent({
        ...register,
      });

      return { ...student, type: RegisterType.STUDENT };
    } else {
      throw new BadRequestException('Tipo não mapeado');
    }
  }
}
