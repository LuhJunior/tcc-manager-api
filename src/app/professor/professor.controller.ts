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
import { ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('Professor')
@Controller()
export class ProfessorController {
  constructor(
    private readonly professorService: ProfessorService,
  ) {}

  @Post('professor/advisor')
  async createProfessorAdvisor(
    @Body() professorData: CreateProfessorAdvisorDto,
  ): Promise<ProfessorResponseDto> {
    if (professorData.professorId) {
      await this.professorService.createProfessorAdvisor({
        professor: {
          connect: {
            id: professorData.professorId,
          },
        },
      });

      return this.professorService.professor({ id: professorData.professorId });
    }

    return this.professorService.createProfessor({ ...professorData, professorAdvisor: { create: { } } });
  }

  @Post('professor/tcc')
  async createProfessorTcc(
    @Body() professorData: CreateProfessorTccDto,
  ): Promise<ProfessorResponseDto> {
    if (professorData.professorId) {
      await this.professorService.createProfessorTcc({
        professor: {
          connect: {
            id: professorData.professorId,
          },
        },
      });

      return this.professorService.professor({ id: professorData.professorId });
    }

    return this.professorService.createProfessor({ ...professorData, professorTcc: { create: { } } });
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

  @Get('professor/:enrollmentCode')
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
    @Param() { skip, take } : FindAllParams,
  ): Promise<ProfessorResponseDto[]> {
    return this.professorService.professors({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @Patch('professor/:id')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  async updateProfessor(
    @Param() { id }: FindByIdParam,
    @Body() professorData: UpdateProfessorDto,
  ): Promise<ProfessorResponseDto> {
    const professor = this.professorService.updateProfessor({
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
    @Param() { id }: FindByIdParam
  ): Promise<ProfessorResponseDto> {
    const professor = this.professorService.deleteProfessor({ id });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }
}