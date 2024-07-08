import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateTripDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsDate()
  @IsOptional()
  startRegister?: Date;

  @IsDate()
  @IsOptional()
  endRegister?: Date;

  @IsDate()
  @IsOptional()
  startTrip?: Date;

  @IsDate()
  @IsOptional()
  endTrip?: Date;

  @IsString()
  @IsOptional()
  tourGuideId?: string;
}
