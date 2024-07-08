import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsDate()
  startRegister: Date;

  @IsDate()
  endRegister: Date;

  @IsDate()
  startTrip: Date;

  @IsDate()
  endTrip: Date;

  @IsString()
  tourGuideId: string;
}
