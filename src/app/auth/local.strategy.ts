import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from '../user/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<UserResponseDto> {
    const user = await this.authService.validateUser(login, password);

    if (!user) {
      throw new UnauthorizedException("Invalid login or password");
    }
    console.log(user)
    return user;
  }
}
