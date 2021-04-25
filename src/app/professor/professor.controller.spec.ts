import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorController } from './professor.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProfessorService } from './professor.service';
import { ProjectService } from '../project/project.service';

describe('AppController', () => {
  let professorController: ProfessorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
      providers: [PrismaService, ProfessorService, ProjectService],
    }).compile();

    professorController = app.get<ProfessorController>(ProfessorController);
  });

  describe('Function createProfessorAdvisor', () => {
    it('should create a professor', () => {
      expect(professorController.createProfessorAdvisor({ name: 'Ana', email: 'ana@gmail.com', enrollmentCode: '123456789', phoneNumber: '(71) 9999999' })).toBeTruthy();
    });
  });
});
