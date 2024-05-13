import { IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  tourGuideId: string;

  @IsString()
  name: string;

  @IsString()
  longitude: string;

  @IsString()
  latitude: string;

  @IsString()
  address: string;

  @IsString()
  description: string;
}
