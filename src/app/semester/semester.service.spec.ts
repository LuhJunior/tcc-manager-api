import { Test, TestingModule } from '@nestjs/testing';
import { SemesterService } from './semester.service';

describe('ClassService', () => {
  let service: SemesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemesterService],
    }).compile();

    service = module.get<SemesterService>(SemesterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
