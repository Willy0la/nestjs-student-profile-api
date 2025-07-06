import { Test, TestingModule } from '@nestjs/testing';
import { StudentsProfileService } from './students-profile.service';

describe('StudentsProfileService', () => {
  let service: StudentsProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsProfileService],
    }).compile();

    service = module.get<StudentsProfileService>(StudentsProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
