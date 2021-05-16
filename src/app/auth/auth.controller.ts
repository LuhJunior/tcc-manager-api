import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RequestWithUser } from './auth.interface';
import { UserResponseDto } from '../user/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDtoRequest, LoginDtoResponse } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser, @Body() _: LoginDtoRequest): Promise<LoginDtoResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req: RequestWithUser): UserResponseDto {
    return req.user;
  }
}
