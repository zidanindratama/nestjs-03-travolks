import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesOnPlaceController } from './categories-on-place.controller';

describe('CategoriesOnPlaceController', () => {
  let controller: CategoriesOnPlaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesOnPlaceController],
    }).compile();

    controller = module.get<CategoriesOnPlaceController>(CategoriesOnPlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
