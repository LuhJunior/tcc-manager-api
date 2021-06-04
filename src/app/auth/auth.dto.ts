import { UserType, RegisterType } from ".prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsString, MaxLength } from "class-validator";

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
  roles: string[];
}

export class CreateRegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MaxLength(15)
  enrollmentCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(RegisterType)
  @ApiProperty({ enum: RegisterType })
  type: RegisterType;
}
