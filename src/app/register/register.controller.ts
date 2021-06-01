import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  NotFoundException,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { UserService } from '../user/user.service';
import { FilterByType, RegisterResponseDto } from './register.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { UserResponseDto } from '../user/user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/enums/role.enum';

@ApiTags('Register')
@Controller('register')
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Post(':id/accept_professor')
  @ApiNotFoundResponse({ description: 'Register not found.' })
  @ApiBadRequestResponse({ description: 'Professor already registered' })
  async createProfessorUser(
    @Param() { id } : FindByIdParam,
  ): Promise<UserResponseDto> {
    const register = await this.registerService.register({ id });

    if (!register || register.type !== 'PROFESSOR') {
      throw new NotFoundException('Register not found.');
    }

    if (await this.userService.user({ login: register.enrollmentCode })) {
      throw new BadRequestException('Professor already registered');
    }

    await this.registerService.updateRegister({ id: register.id }, { deletedAt: new Date() });

    return this.userService.createUser({
      login: register.enrollmentCode,
      password: register.enrollmentCode.substr(0, 6),
      type: 'PROFESSOR',
      professor: {
        create: {
          name: register.name,
          email: register.email,
          enrollmentCode: register.enrollmentCode,
          phoneNumber: register.phoneNumber,
          professorAdvisor: { create: { } },
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ProfessorTcc)
  @Post(':id/accept_student')
  @ApiNotFoundResponse({ description: 'Register not found.' })
  @ApiBadRequestResponse({ description: 'Student already registered' })
  async createStudentUser(
    @Param() { id } : FindByIdParam,
  ): Promise<UserResponseDto> {
    const register = await this.registerService.register({ id });

    if (!register || register.type !== 'STUDENT') {
      throw new NotFoundException('Register not found.');
    }

    if (await this.userService.user({ login: register.enrollmentCode })) {
      throw new BadRequestException('Student already registered');
    }

    await this.registerService.updateRegister({ id: register.id }, { deletedAt: new Date() });

    return this.userService.createUser({
      login: register.enrollmentCode,
      password: register.enrollmentCode.substr(0, 6),
      type: 'STUDENT',
      student: {
        create: {
          name: register.name,
          email: register.email,
          enrollmentCode: register.enrollmentCode,
          phoneNumber: register.phoneNumber,
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Register not found.' })
  async findUserById(
    @Param() { id }: FindByIdParam
  ): Promise<RegisterResponseDto> {
    const register = await this.registerService.register({ id });

    if (!register) {
      throw new NotFoundException('Register not found.');
    }

    return register;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async findAllRegisters(
    @Query() { type } : FilterByType,
    @Query() { skip, take }: FindAllParams,
  ): Promise<RegisterResponseDto[]> {
    return this.registerService.registers({ skip, take, where: type && { type }, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get('professors')
  async findAllProfessorsRegister(
    @Query() { skip, take }: FindAllParams,
  ): Promise<RegisterResponseDto[]> {
    return this.registerService.registers({ skip, take, where: { type: 'PROFESSOR' }, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ProfessorTcc)
  @Get('students')
  async findAllStudentsRegisters(
    @Query() { skip, take }: FindAllParams,
  ): Promise<RegisterResponseDto[]> {
    return this.registerService.registers({ skip, take, where: { type: 'STUDENT' }, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Register not found.' })
  async deleteRegister(
    @Param() { id }: FindByIdParam
  ): Promise<RegisterResponseDto> {
    const register = await this.registerService.deleteRegister({ id });

    if (!register) {
      throw new NotFoundException('Register not found.');
    }

    return register;
  }
}