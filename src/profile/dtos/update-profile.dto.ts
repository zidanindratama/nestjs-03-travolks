import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
