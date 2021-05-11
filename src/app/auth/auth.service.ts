import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.user({ login });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { id: user.id, login: user.login, type: user.type };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}