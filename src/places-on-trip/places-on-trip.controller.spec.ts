import { Test, TestingModule } from '@nestjs/testing';
import { PlacesOnTripController } from './places-on-trip.controller';

describe('PlacesOnTripController', () => {
  let controller: PlacesOnTripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesOnTripController],
    }).compile();

    controller = module.get<PlacesOnTripController>(PlacesOnTripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
