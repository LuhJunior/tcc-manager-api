import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProfessorService } from '../professor/professor.service';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from './project.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';

@ApiTags('Project')
@Controller()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly professorService: ProfessorService,
  ) {}

  @Post('project')
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiBadRequestResponse({ description: 'Professor is not an advisor.' })
  async createProject(
    @Body() { title, description, professorId, files }: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const professor = await this.professorService.professor({ id: professorId });

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    if (!professor.professorAdvisor) {
      throw new HttpException('Professor is not an advisor.', HttpStatus.BAD_REQUEST);
    }

    return this.projectService.createProject({
      title,
      description,
      professorAdvisor: {
        connect: {
          id: professor.professorAdvisor.id,
        },
      },
      files: files && {
        createMany: {
          data: files.map(({ title, description, fileUrl }) => ({ title, description, fileUrl, professorId: professor.id })),
        },
      },
    });
  }

  @Get('project/:id')
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async findProjectById(
    @Param() { id }: FindByIdParam
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.project({ id });

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return project;
  }

  @Get('project/professor/:id')
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async findProjectByProfessorId(
    @Param() { id }: FindByIdParam,
    @Query() { skip, take }: FindAllParams,
  ): Promise<ProjectResponseDto[]> {
    const professor = await this.professorService.professor({ id });

    if (!professor || !professor.professorAdvisor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return this.projectService.projects({ skip, take, where: { professorAdvisorId: professor.professorAdvisor.id }, orderBy: { createdAt: 'desc' } });
  }

  @Get('project')
  async findAllProjects(
    @Param() { skip, take }: FindAllParams,
  ): Promise<ProjectResponseDto[]> {
    return this.projectService.projects({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @Patch('project/:id')
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async updateProjectFields(
    @Param() { id }: FindByIdParam,
    @Body() projectData: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.updateProject({
      where: { id },
      data: projectData,
    });

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return project;
  }

  @Patch('project/:id/deactivate')
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async deactivateProject(
    @Param() { id }: FindByIdParam
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.updateProject({
      where: { id },
      data: {
        status: 'DISABLED',
      },
    });

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return project;
  }

  @Delete('project/:id')
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async deleteProject(
    @Param() { id }: FindByIdParam
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.deleteProject({ id });

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return project;
  }
}