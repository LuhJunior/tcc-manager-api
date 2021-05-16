import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, UserResponseDto } from './user.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('user')
  async createUser(
    @Body() { login, password, type }: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser({ login, password, type });
  }

  @Get('user/:id')
  @ApiNotFoundResponse({ description: 'User not found.' })
  async findUserById(
    @Param() { id }: FindByIdParam
  ): Promise<UserResponseDto> {
    const user = await this.userService.user({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @Get('user')
  async findAllUsers(
    @Param() { skip, take }: FindAllParams,
  ): Promise<UserResponseDto[]> {
    return this.userService.users({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @Patch('user/:id')
  @ApiNotFoundResponse({ description: 'User not found.' })
  async updateUserPassword(
    @Param() { id }: FindByIdParam,
    @Body() { password }: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateUser({ id }, password);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Delete('user/:id')
  @ApiNotFoundResponse({ description: 'User not found.' })
  async deleteUser(
    @Param() { id }: FindByIdParam
  ): Promise<UserResponseDto> {
    const user = await this.userService.deleteUser({ id });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}