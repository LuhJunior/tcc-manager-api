import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import { Role } from 'src/enums/role.enum';
import { UserRequest } from './auth.interface';

function getRoles(type: UserType): Role[] {
  if (type === 'ADMIN') return [Role.Admin];
  if (type === 'COORDINATOR') return [Role.Coordinator];
  if (type === 'PROFESSOR') return [Role.Professor];
  if (type === 'SECRETARY') return [Role.Secretary];
  if (type === 'STUDENT') return [Role.Student];
  return [];
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<UserRequest> {
    const user = await this.authService.validateUser(login, password);

    if (!user) {
      throw new UnauthorizedException("Invalid login or password");
    }

    const roles = getRoles(user.type);

    if (user.professor?.professorAdvisor) roles.push(Role.ProfessorAdvisor);
    if (user.professor?.professorTcc) roles.push(Role.ProfessorTcc);

    return { ...user, roles };
  }
}
