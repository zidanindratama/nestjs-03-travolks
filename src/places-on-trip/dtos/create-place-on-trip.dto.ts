import { IsString } from 'class-validator';

export class CreatePlaceOnTripDto {
  @IsString()
  placeId: string;

  @IsString()
  tripId: string;
}
