import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorController } from './professor.controller';
import { PrismaService } from '../services/prisma.service';
import { ProfessorService } from '../services/professor.service';
import { ProjectService } from '../services/project.service';

describe('AppController', () => {
  let professorController: ProfessorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
      providers: [PrismaService, ProfessorService, ProjectService],
    }).compile();

    professorController = app.get<ProfessorController>(ProfessorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(professorController.addProfessor({ name: 'Ana', email: 'ana@gamil.com', enrollmentCode: '123456789', phoneNumber: '(71) 9999999' })).toBeTruthy();
    });
  });
});
