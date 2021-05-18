import { UserType } from ".prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDtoRequest {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginDtoResponse {
  accessToken: string;
  userType: UserType;
}
