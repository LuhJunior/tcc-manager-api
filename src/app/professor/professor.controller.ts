import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import {
  CreateProfessorAdvisorDto,
  CreateProfessorTccDto,
  FindByIdParam,
  FindByEnrollmentCodeParam,
  FindAllParams,
  UpdateProfessorDto,
  ProfessorResponseDto
} from './professor.dto';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@ApiTags('Professor')
@Controller()
export class ProfessorController {
  constructor(
    private readonly professorService: ProfessorService,
    private readonly userService: UserService,
  ) {}

  @Post('professor/advisor')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiBadRequestResponse({ description: 'Professor Advisor already registry for the given professorId.' })
  async createProfessorAdvisor(
    @Body() professorData: CreateProfessorAdvisorDto,
  ): Promise<ProfessorResponseDto> {
    if (professorData.professorId) {
      const professor = await this.professorService.professor({ id: professorData.professorId });

      if (!professor) {
        throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
      }

      if (professor.professorAdvisor) {
        throw new HttpException('Professor Advisor already registry for the given professorId.', HttpStatus.BAD_REQUEST);
      }

      await this.professorService.createProfessorAdvisor({
        professor: {
          connect: {
            id: professorData.professorId,
          },
        },
      });

      return this.professorService.professor({ id: professorData.professorId });
    }

    await this.userService.createUser({
      login: professorData.enrollmentCode,
      password: professorData.enrollmentCode.substr(0, 6),
    });

    return this.professorService.createProfessor({
      ...professorData,
      professorAdvisor: {
        create: { },
      },
      user: {
        connect: { login: professorData.enrollmentCode },
      },
    });
  }

  @Post('professor/tcc')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiBadRequestResponse({ description: 'Professor TCC already registry for the given professorId.' })
  async createProfessorTcc(
    @Body() professorData: CreateProfessorTccDto,
  ): Promise<ProfessorResponseDto> {
    if (professorData.professorId) {
      const professor = await this.professorService.professor({ id: professorData.professorId });

      if (!professor) {
        throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
      }

      if (professor.professorTcc) {
        throw new HttpException('Professor TCC already registry for the given professorId.', HttpStatus.BAD_REQUEST);
      }

      await this.professorService.createProfessorTcc({
        professor: {
          connect: {
            id: professorData.professorId,
          },
        },
      });

      return this.professorService.professor({ id: professorData.professorId });
    }

    await this.userService.createUser({
      login: professorData.enrollmentCode,
      password: professorData.enrollmentCode.substr(0, 6),
    });

    return this.professorService.createProfessor({
      ...professorData,
      professorTcc: {
        create: { },
      },
      user: {
        connect: { login: professorData.enrollmentCode },
      },
    });
  }


  @Get('professor/:id')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async findProfessorById(@Param() { id }: FindByIdParam): Promise<ProfessorResponseDto> {
    const professor = await this.professorService.professor({ id });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }

  @Get('professor/enrollmentCode/:enrollmentCode')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async findProfessorByEnrollmentCode(@Param() { enrollmentCode }: FindByEnrollmentCodeParam): Promise<ProfessorResponseDto> {
    const professor = await this.professorService.professor({ enrollmentCode });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }

  @Get('professor')
  async findAllProfessors(
    @Query() { skip, take } : FindAllParams,
  ): Promise<ProfessorResponseDto[]> {
    return this.professorService.professors({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @Patch('professor/:id')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async updateProfessor(
    @Param() { id }: FindByIdParam,
    @Body() professorData: UpdateProfessorDto,
  ): Promise<ProfessorResponseDto> {
    const professor = await this.professorService.updateProfessor({
      data: professorData,
      where: { id },
    });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }

  @Delete('professor/:id')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async deleteProfessor(
    @Param() { id }: FindByIdParam,
  ): Promise<ProfessorResponseDto> {
    const professor = await this.professorService.deleteProfessor({ id });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }
}