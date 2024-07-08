import { Test, TestingModule } from '@nestjs/testing';
import { PlacesOnTripService } from './places-on-trip.service';

describe('PlacesOnTripService', () => {
  let service: PlacesOnTripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacesOnTripService],
    }).compile();

    service = module.get<PlacesOnTripService>(PlacesOnTripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
