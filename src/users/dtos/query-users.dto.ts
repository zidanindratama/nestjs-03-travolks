import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../enums/roles.enum';
import { Gender } from '../../profile/enums/gender.enum';

export class QueryUsersDto {
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  pgNum?: string;

  @IsString()
  @IsOptional()
  pgSize?: string;
}
