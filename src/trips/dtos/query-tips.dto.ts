import { IsOptional, IsString } from 'class-validator';

export class QueryTripsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsOptional()
  pgNum?: string;

  @IsString()
  @IsOptional()
  pgSize?: string;
}
