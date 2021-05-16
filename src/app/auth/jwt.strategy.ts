import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserType } from '@prisma/client';
import { Role } from '../../enums/role.enum';
import { UserRequest } from './auth.interface';

function getRoles(type: UserType): Role[] {
  if (type === 'ADMIN') return [Role.Admin];
  if (type === 'COORDINATOR') return [Role.Coordinator];
  if (type === 'PROFESSOR') return [Role.Professor];
  if (type === 'SECRETARY') return [Role.Secretary];
  if (type === 'STUDENT') return [Role.Student];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'Segredo',
    });
  }

  async validate({ id }: { id:  string; }): Promise<UserRequest> {
    const user = await this.userService.user({ id });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const roles = getRoles(user.type);
    console.log(roles)

    if (user.professor?.professorAdvisor) roles.push(Role.ProfessorAdvisor);
    if (user.professor?.professorTcc) roles.push(Role.ProfessorTcc);
    return { ...user, roles };
  }
}
