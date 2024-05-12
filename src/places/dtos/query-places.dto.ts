import { IsOptional, IsString } from 'class-validator';

export class QueryPlacesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsString()
  @IsOptional()
  pgNum?: string;

  @IsString()
  @IsOptional()
  pgSize?: string;
}
