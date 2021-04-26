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
import { ProjectService } from './project.service';
import { ProfessorService } from '../professor/professor.service';
import { Project as ProjectModel } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto, UpdateProjectFieldsDto } from './project.validation';
import { FindAllParams, FindByIdParam } from '../professor/professor.validation';

@Controller()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly professorService: ProfessorService,
  ) {}

  @Post('project')
  async createProject(
    @Body() { title, description, professorAdvisorId, files }: CreateProjectDto,
  ): Promise<ProjectModel> {
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
  async findProjectById(
    @Param() { id }: FindByIdParam
  ): Promise<ProjectModel> {
    const project = await this.projectService.project({ id });

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return project;
  }

  @Get('project')
  async findAllProjects(
    @Param() { skip, take }: FindAllParams,
  ): Promise<ProjectModel[]> {
    return this.projectService.projects({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @Put('project/:id')
  async updateProject(
    @Param() { id }: FindByIdParam,
    @Body() projectData: UpdateProjectDto,
  ): Promise<ProjectModel> {
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
  async updateProjectFields(
    @Param() { id }: FindByIdParam,
    @Body() projectData: UpdateProjectFieldsDto,
  ): Promise<ProjectModel> {
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
  async deactivateProject(
    @Param() { id }: FindByIdParam
  ): Promise<ProjectModel> {
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
  async deleteProject(
    @Param() { id }: FindByIdParam
  ): Promise<ProjectModel> {
    const project = await this.projectService.deleteProject({ id });

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return project;
  }
}