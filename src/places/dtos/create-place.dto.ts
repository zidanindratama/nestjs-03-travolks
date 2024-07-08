import { IsString } from 'class-validator';

export class CreatePlaceDto {
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
