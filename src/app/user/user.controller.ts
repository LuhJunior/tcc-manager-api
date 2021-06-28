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
  ConflictException,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UpdateUserQuery, UserResponseDto } from './user.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfessorService } from '../professor/professor.service';
import { RequestWithUser } from '../auth/auth.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly professorService: ProfessorService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async createUser(
    @Body() { login, password, type, ...professor }: CreateUserDto,
  ): Promise<UserResponseDto> {
    if (await this.userService.checkUser({ login }) || (professor.enrollmentCode && await this.professorService.professor({ enrollmentCode: professor.enrollmentCode }))) {
      throw new ConflictException('Login or enrrolment code was already used.');
    }

    return this.userService.createUser({
      login,
      password,
      type,
      professor: ['PROFESSOR', 'COORDINATOR'].includes(type) ? {
        create: {
          ...professor,
          professorTcc: { create: { } },
          professorAdvisor: { create: { } },
        },
      } : undefined,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
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
  @Get()
  async findAllUsers(
    @Query() { skip, take }: FindAllParams,
    @Request() req: RequestWithUser,
  ): Promise<UserResponseDto[]> {
    return this.userService.users({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        id: {
          not: req.user.id,
        },
        type: {
          not: 'ADMIN',
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiConflictResponse({ description: 'Professor enrollmentCode already registred' })
  async updateUser(
    @Param() { id }: FindByIdParam,
    @Query() { type } : UpdateUserQuery,
    @Body() { password, name, enrollmentCode, email, phoneNumber }: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.user({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (
      ['PROFESSOR', 'COORDINATOR', 'STUDENT'].includes(user.type)
      && !user.professor
      && await this.professorService.professor({ enrollmentCode })
    ) {
      throw new ConflictException('Professor enrollmentCode already registred');
    }

    return this.userService.updateUser({ id }, {
      password,
      professor: ['PROFESSOR', 'COORDINATOR'].includes(type) ? {
        upsert: {
          create: {
            name, enrollmentCode, email, phoneNumber,
          },
          update: {
            name, email, phoneNumber,
          },
        }
      } : undefined,
      student: type === 'STUDENT' ? {
        upsert: {
          create: {
            name, enrollmentCode, email, phoneNumber,
          },
          update: {
            name, email, phoneNumber,
          },
        },
      } : undefined,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'User not found.' })
  async deleteUser(
    @Param() { id }: FindByIdParam
  ): Promise<UserResponseDto> {
    const user = await this.userService.deleteUser({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}