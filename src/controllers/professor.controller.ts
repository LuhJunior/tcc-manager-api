import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProfessorService } from '../services/professor.service';
import { Professor as ProfessorModel } from '@prisma/client';

@Controller()
export class ProfessorController {
  constructor(
    private readonly professorService: ProfessorService,
  ) {}

  @Post('professor')
  async addProfessor(
    @Body() professorData: { name: string; email: string, enrollmentCode: string, phoneNumber: string },
  ): Promise<ProfessorModel> {
    return this.professorService.createProfessor(professorData);
  }


  @Get('professor/:id')
  async findProfessorById(@Param('id') id: string): Promise<ProfessorModel> {
    return this.professorService.professor({ id });
  }

  @Get('professor')
  async findAllProfessors(
    @Param('skip') skip?: number,
    @Param('take') take?: number,
  ): Promise<ProfessorModel[]> {
    return this.professorService.professors({ skip, take });
  }

  @Put('professor/:id')
  async alterUser(
    @Param('id') id: string,
    @Body() professorData: { name: string | undefined; email: string | undefined, enrollmentCode: string | undefined, phoneNumber: string | undefined },
  ): Promise<ProfessorModel> {
    return this.professorService.updateProfessor({
      data: professorData,
      where: { id },
    });
  }

  @Delete('professor/:id')
  async removeProfessor(@Param('id') id: string): Promise<ProfessorModel> {
    return this.professorService.deleteProfessor({ id });
  }
}