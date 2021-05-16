import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<UserResponseDto | null> {
    const user = await this.userService.user({ login });

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserResponseDto) {
    const payload = { id: user.id, login: user.login, type: user.type };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
