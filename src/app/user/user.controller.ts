import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, UserResponseDto } from './user.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('user')
  async createUser(
    @Body() { login, password, type }: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser({ login, password, type });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('user')
  async findAllUsers(
    @Query() { skip, take }: FindAllParams,
  ): Promise<UserResponseDto[]> {
    return this.userService.users({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('user/:id')
  @ApiNotFoundResponse({ description: 'User not found.' })
  async updateUserPassword(
    @Param() { id }: FindByIdParam,
    @Body() { password }: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateUser({ id }, password);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('user/:id')
  @ApiNotFoundResponse({ description: 'User not found.' })
  async deleteUser(
    @Param() { id }: FindByIdParam
  ): Promise<UserResponseDto> {
    const user = await this.userService.deleteUser({ id });

    if (!user) {
      throw new NotFoundException('User not found.',);
    }

    return user;
  }
}