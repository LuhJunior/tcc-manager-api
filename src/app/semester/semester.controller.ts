import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  Query,
  NotFoundException,
  ConflictException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse, ApiConflictResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateSemesterDto,
  SemesterResponseDto,
  SemesterWithClassResponseDto,
  UpdateSemesterDto,
} from './semester.dto';
import { FindAllParams, FindByIdParam } from '../professor/professor.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SemesterService } from './semester.service';


@ApiTags('Semester')
@Controller('semester')
export class SemesterController {
  constructor(
    private readonly semesterService: SemesterService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Post()
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  @ApiConflictResponse({ description: 'Semester already registered.' })
  @ApiConflictResponse({ description: 'Received period has a conflict with one registred semester.' })
  @ApiBadRequestResponse({ description: 'Semester can\'t have less than 100 days.' })
  @ApiBadRequestResponse({ description: 'Semester start period can\'t be greater than end period.' })
  async createSemester(
    @Body() { code, startPeriod, endPeriod }: CreateSemesterDto,
  ): Promise<SemesterResponseDto> {
    const conflict = await this.semesterService.conflictPeriodSemester(startPeriod, endPeriod);
    if (conflict) {
      throw new ConflictException(conflict, 'Received period has a conflict with one registred semester.');
    }

    if (startPeriod > endPeriod) {
      throw new BadRequestException('Semester start period can\'t be greater than end period.');
    }

    // 100 days * 24 hours * 60 minutes * 60 seconds * 1000 miliseconds
    if (startPeriod.getTime() + 8640000000 > endPeriod.getTime()) {
      throw new BadRequestException('Semester can\'t have less than 100 days.');
    }

    if (await this.semesterService.checkSemester({ code })) {
      throw new ConflictException('Semester already registered.');
    }

    return {
      ...await this.semesterService.createSemester({
        code,
        startPeriod,
        endPeriod,
      })
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get()
  @ApiBearerAuth()
  async findAllSemesters(
    @Query() { skip, take }: FindAllParams,
  ): Promise<SemesterWithClassResponseDto[]> {
    return this.semesterService.semesters({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get('current')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  async findCurrentSemeter(): Promise<SemesterWithClassResponseDto> {
    const semester = await this.semesterService.currentSemester();

    if (!semester) {
      throw new NotFoundException('Semester not found.');
    }

    return semester;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Get(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  async findSemesterById(
    @Param() { id }: FindByIdParam
  ): Promise<SemesterWithClassResponseDto> {
    const semester = await this.semesterService.semester({ id });

    if (!semester) {
      throw new NotFoundException('Semester not found.');
    }

    return semester;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Put(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  @ApiConflictResponse({ description: 'Semester already registered.' })
  @ApiConflictResponse({ description: 'Received period has a conflict with one registred semester.' })
  @ApiBadRequestResponse({ description: 'Semester can\'t have less than 100 days.' })
  @ApiBadRequestResponse({ description: 'Semester start period can\'t be greater than end period.' })
  async updateSemester(
    @Param() { id }: FindByIdParam,
    @Body() { code, startPeriod, endPeriod }: CreateSemesterDto,
  ): Promise<SemesterWithClassResponseDto> {
    const conflict = await this.semesterService.conflictPeriodSemester(startPeriod, endPeriod);
    if (conflict) {
      throw new ConflictException(conflict, 'Received period has a conflict with one registred semester.');
    }

    if (startPeriod > endPeriod) {
      throw new BadRequestException('Semester start period can\'t be greater than end period.');
    }

    // 100 days * 24 hours * 60 minutes * 60 seconds * 1000 miliseconds
    if (startPeriod.getTime() + 8640000000 > endPeriod.getTime()) {
      throw new BadRequestException('Semester can\'t have less than 100 days.');
    }

    if (await this.semesterService.checkSemester({ code })) {
      throw new ConflictException('Semester already registered.');
    }

    const semester = await this.semesterService.updateSemester({ id }, { code, startPeriod, endPeriod });

    if (!semester) {
      throw new NotFoundException('Semester not found.');
    }

    return semester;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  @ApiConflictResponse({ description: 'Semester already registered.' })
  @ApiConflictResponse({ description: 'Received period has a conflict with one registred semester.' })
  @ApiBadRequestResponse({ description: 'Semester can\'t have less than 100 days.' })
  @ApiBadRequestResponse({ description: 'Semester start period can\'t be greater than end period.' })
  async partialUpdateSemester(
    @Param() { id }: FindByIdParam,
    @Body() { code, startPeriod, endPeriod }: UpdateSemesterDto,
  ): Promise<SemesterWithClassResponseDto> {
    if (startPeriod && endPeriod) {
      const conflict = await this.semesterService.conflictPeriodSemester(startPeriod, endPeriod);
      if (conflict) {
        throw new ConflictException(conflict, 'Received period has a conflict with one registred semester.');
      }

      if (startPeriod > endPeriod) {
        throw new BadRequestException('Semester start period can\'t be greater than end period.');
      }

      // 100 days * 24 hours * 60 minutes * 60 seconds * 1000 miliseconds
      if (startPeriod.getTime() + 8640000000 > endPeriod.getTime()) {
        throw new BadRequestException('Semester can\'t have less than 100 days.');
      }
    }

    if (code && await this.semesterService.checkSemester({ code })) {
      throw new ConflictException('Semester already registered.');
    }

    const semester = await this.semesterService.updateSemester({ id }, { code, startPeriod, endPeriod });

    if (!semester) {
      throw new NotFoundException('Semester not found.');
    }

    return semester;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  async deleteSemester(
    @Param() { id }: FindByIdParam
  ): Promise<SemesterResponseDto> {
    const semester = await this.semesterService.deleteSemester({ id });

    if (!semester) {
      throw new NotFoundException('Semester not found.');
    }

    return semester;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Secretary)
  @Delete(':id/semester/hard')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Semester not found.' })
  async hardDeleteSemester(
    @Param() { id }: FindByIdParam
  ): Promise<SemesterResponseDto> {
    const semester = await this.semesterService.hardDeleteSemester({ id });

    if (!semester) {
      throw new NotFoundException('Semester not found.');
    }

    return semester;
  }
}
