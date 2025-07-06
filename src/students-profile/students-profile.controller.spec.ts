import { Test, TestingModule } from '@nestjs/testing';
import { StudentsProfileController } from './students-profile.controller';

describe('StudentsProfileController', () => {
  let controller: StudentsProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsProfileController],
    }).compile();

    controller = module.get<StudentsProfileController>(StudentsProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
