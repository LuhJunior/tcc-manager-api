import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProfessorService } from '../professor/professor.service';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto, CreateProjectApplicationDto, ProjectAgreementPdfResponseDto } from './project.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { Application } from '.prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/auth.interface';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { DataUploadService } from '../data.upload/data.upload.service';
import { PdfService } from '../pdf/pdf.service';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly professorService: ProfessorService,
    private readonly dataUploadServie: DataUploadService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ProfessorAdvisor)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Professor not found.' })
  @ApiBadRequestResponse({ description: 'Professor is not an advisor.' })
  async createProject(
    @Request() req: RequestWithUser,
    @Body() { title, description, files }: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const professor = await this.professorService.professor({ id: req.user.professor?.id });

    if (!professor) throw new NotFoundException('Professor not found.');

    if (!professor.professorAdvisor)  throw new BadRequestException('Professor is not an advisor.');

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('application')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Project or Student not found.' })
  @ApiBadRequestResponse({ description: 'Student already have an application in progress for this project.' })
  @ApiBadRequestResponse({ description: 'Student was already accepted in other project.' })
  async createProjectApplication(
    @Request() req: RequestWithUser,
    @Body() { projectId }: CreateProjectApplicationDto,
  ): Promise<Application> {
    const applications = await this.projectService.applications({
      where: {
        projectId,
        studentId: req.user.student?.id,
        OR: [
          { status: 'IN_PROGRESS' },
          { status: 'ACCEPTED' },
        ],
      },
    });

    if (applications.length) throw new BadRequestException('Student already have an application for this project.');

    const acceptedApps = await this.projectService.applications({
      where: {
        studentId: req.user.student?.id,
        status: 'ACCEPTED',
        project: {
          status: 'IN_PROGRESS',
        },
      },
    });

    if (acceptedApps.length) throw new BadRequestException('Student was already accepted in other project.');

    const application = await this.projectService.createProjectApplication(projectId, req.user.student?.id);

    if (!application) throw new NotFoundException('Project or Student not found.');

    return application;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async findProjectById(
    @Param() { id }: FindByIdParam
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.project({ id });

    if (!project) throw new NotFoundException('Project not found.');

    return project;
  }

  @UseGuards(JwtAuthGuard)
  @Get('professor/:id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async findProjectByProfessorId(
    @Param() { id }: FindByIdParam,
    @Query() { skip, take }: FindAllParams,
  ): Promise<ProjectResponseDto[]> {
    const professor = await this.professorService.professor({ id });

    if (!professor || !professor.professorAdvisor) throw new NotFoundException('Professor not found.');

    return this.projectService.projects({ skip, take, where: { professorAdvisorId: professor.professorAdvisor.id }, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  async findAllProjects(
    @Param() { skip, take }: FindAllParams,
  ): Promise<ProjectResponseDto[]> {
    return this.projectService.projects({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  @UseGuards(JwtAuthGuard)
  @Get('application/:id/agreement')
  @Roles(Role.Student)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Application not found.' })
  @ApiBadRequestResponse({ description: 'Application was not accepted' })
  async generateProjectApplicationAgreement(
    @Request() req: RequestWithUser,
    @Param() { id }: FindByIdParam,
  ): Promise<ProjectAgreementPdfResponseDto> {
    const application = await this.projectService.applicationWithProfessor({ id });

    if (!application || application.studentId !== req.user.student?.id) throw new NotFoundException('Application not found.');

    if (application.status !== 'ACCEPTED') throw new BadRequestException('Application was not accepted');

    const { project: { professorAdvisor: { professor } } } = application;

    const buffer =  await this.pdfService.createPdf(professor.name, professor.email, application.project.title, req.user.student.name);

    const [fileUrl] = await this.dataUploadServie.sendFileUpload([{ filename: `TERMO_ACEITACAO_${professor.name}_${req.user.student.name}_${application.project.title}.pdf`, buffer }]);

    return { fileUrl };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ProfessorAdvisor)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async updateProjectFields(
    @Request() req: RequestWithUser,
    @Param() { id }: FindByIdParam,
    @Body() { title, description, files }: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.updateProject({
      where: { id, professorAdvisorId: req.user.professor?.professorAdvisor?.id },
      data: {
        title,
        description,
        files: files && {
          createMany: {
            data: files.map(({ title, description, fileUrl }) => ({ title, description, fileUrl, professorId: req.user.professor?.id })),
          },
        },
      },
    });

    if (!project) throw new NotFoundException('Project not found.');

    return project;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/deactivate')
  @Roles(Role.ProfessorAdvisor)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Project not found.' })
  @ApiBadRequestResponse({ description: 'Project is already deactivated.' })
  @ApiBadRequestResponse({ description: 'Can\'t deactivate a project in progress.' })
  async deactivateProject(
    @Request() req: RequestWithUser,
    @Param() { id }: FindByIdParam,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.project({ id });

    if (!project || project.professorAdvisorId !== req.user.professor?.professorAdvisor?.id) throw new NotFoundException('Project not found.');

    if (project.status === 'DISABLED') throw new BadRequestException('Project is already deactivated.');

    if (project.status === 'IN_PROGRESS') throw new BadRequestException('Can\'t deactivate a project in progress.');

    return this.projectService.updateProject({
      where: { id },
      data: {
        status: 'DISABLED',
      },
    });;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('application/:id/accept')
  @Roles(Role.ProfessorAdvisor)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Application not found.' })
  @ApiBadRequestResponse({ description: 'Application was already acepted or rejected.' })
  @ApiBadRequestResponse({ description: 'Project already have a student work on it.' })
  async acceptProjectApplication(
    @Request() req: RequestWithUser,
    @Param() { id }: FindByIdParam,
  ): Promise<{ project: ProjectResponseDto, application: Application }> {
    const application = await this.projectService.application({ id });

    if (application.status !== 'IN_PROGRESS') throw new BadRequestException('Application was already acepted or rejected.');

    if (!application || application.project.professorAdvisorId !== req.user.professor?.professorAdvisor?.id) throw new NotFoundException('Project not found.');

    if (application.project.status === 'IN_PROGRESS') throw new BadRequestException('Project already have a student work on it.');

    const data = await this.projectService.acceptProjectApplication(id, req.user.professor?.professorAdvisor?.id);

    if (!data) throw new NotFoundException('Application not found.');

    return data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('application/:id/reject')
  @Roles(Role.ProfessorAdvisor)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Application not found.' })
  @ApiBadRequestResponse({ description: 'Application was already acepted or rejected.' })
  async rejectProjectApplication(
    @Request() req: RequestWithUser,
    @Param() { id }: FindByIdParam,
  ): Promise<Application> {
    const application = await this.projectService.application({ id });

    if (application.status !== 'IN_PROGRESS') throw new BadRequestException('Application was already acepted or rejected.');

    if (!application || application.project.professorAdvisorId !== req.user.professor?.professorAdvisor?.id) throw new NotFoundException('Application not found.');

    return this.projectService.rejectProjectApplication(id, req.user.professor?.professorAdvisor?.id);;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('application/:id/remove')
  @Roles(Role.ProfessorAdvisor, Role.Student)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Application not found.' })
  async removeProjectApplication(
    @Request() req: RequestWithUser,
    @Param() { id }: FindByIdParam,
  ): Promise<Application> {
    const application = await this.projectService.application({ id });

    if (!application || (application.project.professorAdvisorId !== req.user.professor?.professorAdvisor?.id && application.studentId !== req.user.student?.id)) {
      throw new NotFoundException('Application not found.');
    }

    return this.projectService.deleteProjectApplication(id, application.project.professorAdvisorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ProfessorAdvisor)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async deleteProject(
    @Request() req: RequestWithUser,
    @Param() { id }: FindByIdParam,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectService.project({ id });

    if (!project ||  project.professorAdvisorId !== req.user.professor?.professorAdvisor?.id) throw new NotFoundException('Project not found.');

    if (project.status === 'IN_PROGRESS') throw new BadRequestException('Can\'t delete a project in progress.');

    return this.projectService.deleteProject({ id });;
  }
}
