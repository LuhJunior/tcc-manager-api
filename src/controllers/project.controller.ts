import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { Project as ProjectModel } from '@prisma/client';

@Controller()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Post('project')
  async addProject(
    @Body() { title, description, professorAdvisorId }: { title: string; description: string; professorAdvisorId: string; },
  ): Promise<ProjectModel> {
    return this.projectService.createProject({
      title,
      description,
      professorAdvisor: {
        connect: {
          id: professorAdvisorId,
        }
      }
    });
  }

  @Get('project/:id')
  async findProjectById(@Param('id') id: string): Promise<ProjectModel> {
    return this.projectService.project({ id });
  }

  @Get('project')
  async findAllProjects(
    @Param('skip') skip?: number,
    @Param('take') take?: number,
  ): Promise<ProjectModel[]> {
    return this.projectService.projects({ skip, take, where: { deletedAt: null } });
  }

  @Put('project/:id')
  async alterProject(
    @Param('id') id: string,
    @Body() projectData: { title: string; description: string; },
  ): Promise<ProjectModel> {
    return this.projectService.updateProject({
      where: { id },
      data: projectData,
    });
  }

  @Patch('project/:id')
  async alterProjectFiels(
    @Param('id') id: string,
    @Body() projectData: { title: string | undefined; description: string | undefined; },
  ): Promise<ProjectModel> {
    return this.projectService.updateProject({
      where: { id },
      data: projectData,
    });
  }

  @Delete('project/:id')
  async deleteProject(@Param('id') id: string): Promise<ProjectModel> {
    return this.projectService.deleteProject({ id });
  }
}