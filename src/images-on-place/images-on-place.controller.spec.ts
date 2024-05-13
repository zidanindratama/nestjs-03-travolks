import { Test, TestingModule } from '@nestjs/testing';
import { ImagesOnPlaceController } from './images-on-place.controller';

describe('ImagesOnPlaceController', () => {
  let controller: ImagesOnPlaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesOnPlaceController],
    }).compile();

    controller = module.get<ImagesOnPlaceController>(ImagesOnPlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
