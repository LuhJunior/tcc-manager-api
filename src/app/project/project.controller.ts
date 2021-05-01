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
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProfessorService } from '../professor/professor.service';
import { CreateProjectDto, UpdateProjectDto, UpdateProjectFieldsDto, ProjectResponseDto } from './project.dto';
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
  async createProject(
    @Body() { title, description, professorAdvisorId, files }: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const professor = await this.professorService.professorByProfessorAdvisorId(professorAdvisorId);

    if (!professor) {
      throw new HttpException('Professor not found.', HttpStatus.NOT_FOUND);
    }

    return this.projectService.createProject({
      title,
      description,
      professorAdvisor: {
        connect: {
          id: professorAdvisorId,
        }
      },
      files: {
        createMany: {
          data: files.map(({ title, description, fileUrl }) => ({ title, description, fileUrl, professorId: professor.id })),
        },
      }
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

  @Get('project')
  async findAllProjects(
    @Param() { skip, take }: FindAllParams,
  ): Promise<ProjectResponseDto[]> {
    return this.projectService.projects({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @Put('project/:id')
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async updateProject(
    @Param() { id }: FindByIdParam,
    @Body() projectData: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.updateProject({
      where: { id },
      data: projectData,
    })

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return project;
  }

  @Patch('project/:id')
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async updateProjectFields(
    @Param() { id }: FindByIdParam,
    @Body() projectData: UpdateProjectFieldsDto,
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

  @Delete('project/deactivate/:id')
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