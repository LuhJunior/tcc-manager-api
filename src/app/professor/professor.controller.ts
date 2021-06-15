import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Request,
  Delete,
  HttpStatus,
  HttpException,
  Query,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import {
  CreateProfessorAdvisorDto,
  CreateProfessorTccDto,
  FindByIdParam,
  FindByEnrollmentCodeParam,
  FindAllParams,
  UpdateProfessorDto,
  ProfessorResponseWithAdvisorAndTccDto
} from './professor.dto';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/auth.interface';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Professor')
@Controller()
export class ProfessorController {
  constructor(
    private readonly professorService: ProfessorService,
    private readonly userService: UserService,
  ) {}

  @Post('professor/advisor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiBadRequestResponse({ description: 'Professor Advisor already registry for the given professorId.' })
  async createProfessorAdvisor(
    @Body() professorData: CreateProfessorAdvisorDto,
  ): Promise<ProfessorResponseWithAdvisorAndTccDto> {
    if (professorData.professorId) {
      const professor = await this.professorService.professor({ id: professorData.professorId });

      if (!professor) throw new NotFoundException('Professor not found.')

      if (professor.professorAdvisor) {
        throw new BadRequestException('Professor Advisor already registry for the given professorId.')
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
      type: 'PROFESSOR',
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiBadRequestResponse({ description: 'Professor TCC already registry for the given professorId.' })
  async createProfessorTcc(
    @Body() professorData: CreateProfessorTccDto,
  ): Promise<ProfessorResponseWithAdvisorAndTccDto> {
    if (professorData.professorId) {
      const professor = await this.professorService.professor({ id: professorData.professorId });

      if (!professor) throw new NotFoundException('Professor not found.')

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
      type: 'PROFESSOR',
    });

    return this.professorService.createProfessor({
      ...professorData,
      professorTcc: {
        create: { },
      },
      professorAdvisor: {
        create: { },
      },
      user: {
        connect: { login: professorData.enrollmentCode },
      },
    });
  }


  @Get('professor/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Professor)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async findAuthProfessor(@Request() req: RequestWithUser): Promise<ProfessorResponseWithAdvisorAndTccDto> {
    const professor = await this.professorService.professor({ userId: req.user.id });

    if (!professor) throw new NotFoundException('Professor not found.');

    return professor;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get('professor/enrollmentCode/:enrollmentCode')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async findProfessorByEnrollmentCode(@Param() { enrollmentCode }: FindByEnrollmentCodeParam): Promise<ProfessorResponseWithAdvisorAndTccDto> {
    const professor = await this.professorService.professor({ enrollmentCode });

    if (!professor) throw new NotFoundException('Professor not found.');

    return professor;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get('professor')
  @ApiBearerAuth()
  async findAllProfessors(
    @Query() { skip, take } : FindAllParams,
  ): Promise<ProfessorResponseWithAdvisorAndTccDto[]> {
    return this.professorService.professors({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get('professor/create/class/:id')
  @ApiBearerAuth()
  async findAllProfessorsTcc(
    @Param() { id }: FindByIdParam,
    @Query() { skip, take } : FindAllParams,
  ): Promise<ProfessorResponseWithAdvisorAndTccDto[]> {
    return this.professorService.professors({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        AND: [
          {
            NOT: {
              professorTcc: null,
            },
          },
          {
            professorTcc: {
              classes: {
                none: {
                  classId: id,
                },
              },
            },
          },
        ],
      },
    });
  }


  @Get('professor/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async findProfessorById(@Param() { id }: FindByIdParam): Promise<ProfessorResponseWithAdvisorAndTccDto> {
    const professor = await this.professorService.professor({ id });

    if (!professor) throw new NotFoundException('Professor not found.');

    return professor;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Professor)
  @Patch('professor')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async updateProfessor(
    @Request() req: RequestWithUser,
    @Body() professorData: UpdateProfessorDto,
  ): Promise<ProfessorResponseWithAdvisorAndTccDto> {
    const professor = await this.professorService.updateProfessor({
      data: professorData,
      where: { id: req.user.professor?.id },
    });

    if (!professor) throw new NotFoundException('Professor not found.');

    return professor;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete('professor/:id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async deleteProfessor(
    @Param() { id }: FindByIdParam,
  ): Promise<ProfessorResponseWithAdvisorAndTccDto> {
    const professor = await this.professorService.deleteProfessor({ id });

    if (!professor) throw new NotFoundException('Professor not found.');

    return professor;
  }
}