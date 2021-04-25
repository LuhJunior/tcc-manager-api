import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { Professor as ProfessorModel } from '@prisma/client';
import {
  CreateProfessorAdvisorDto,
  CreateProfessorTccDto,
  FindByIdParam,
  FindByEnrollmentCodeParam,
  FindAllParams,
  UpdateProfessorDto
} from './professor.validation';

@Controller()
export class ProfessorController {
  constructor(
    private readonly professorService: ProfessorService,
  ) {}

  @Post('professor/advisor')
  async createProfessorAdvisor(
    @Body() professorData: CreateProfessorAdvisorDto,
  ): Promise<ProfessorModel> {
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
  ): Promise<ProfessorModel> {
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
  async findProfessorById(@Param() { id }: FindByIdParam): Promise<ProfessorModel> {
    const professor = await this.professorService.professor({ id });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }

  @Get('professor/:enrollmentCode')
  async findProfessorByEnrollmentCode(@Param() { enrollmentCode }: FindByEnrollmentCodeParam): Promise<ProfessorModel> {
    const professor = await this.professorService.professor({ enrollmentCode });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }

  @Get('professor')
  async findAllProfessors(
    @Param() { skip, take } : FindAllParams,
  ): Promise<ProfessorModel[]> {
    return this.professorService.professors({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @Patch('professor/:id')
  async updateProfessor(
    @Param() { id }: FindByIdParam,
    @Body() professorData: UpdateProfessorDto,
  ): Promise<ProfessorModel> {
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
  async deleteProfessor(
    @Param() { id }: FindByIdParam
  ): Promise<ProfessorModel> {
    const professor = this.professorService.deleteProfessor({ id });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return professor;
  }
}