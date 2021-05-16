import { Request } from 'express';
import { Role } from '../../enums/role.enum';
import { UserResponseDto } from '../user/user.dto';

export class UserRequest extends UserResponseDto {
  roles: Role[];
}

export interface RequestWithUser extends Request {
  user: UserRequest;
}
