import { IsOptional, IsString } from 'class-validator';

export class QueryPlacesOnTripDto {
  @IsString()
  @IsOptional()
  pgNum?: string;

  @IsString()
  @IsOptional()
  pgSize?: string;
}
