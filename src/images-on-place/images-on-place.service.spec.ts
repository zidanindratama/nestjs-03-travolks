import { Test, TestingModule } from '@nestjs/testing';
import { ImagesOnPlaceService } from './images-on-place.service';

describe('ImagesOnPlaceService', () => {
  let service: ImagesOnPlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesOnPlaceService],
    }).compile();

    service = module.get<ImagesOnPlaceService>(ImagesOnPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
