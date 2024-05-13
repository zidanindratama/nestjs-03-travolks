import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesOnPlaceService } from './categories-on-place.service';

describe('CategoriesOnPlaceService', () => {
  let service: CategoriesOnPlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesOnPlaceService],
    }).compile();

    service = module.get<CategoriesOnPlaceService>(CategoriesOnPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
