import { IsOptional, IsString } from 'class-validator';

export class UpdatePlaceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  longitude?: string;

  @IsString()
  @IsOptional()
  latitude?: string;

  @IsString()
  @IsOptional()
  address?;

  @IsString()
  @IsOptional()
  description?: string;
}
