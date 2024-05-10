import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../enums/roles.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;

  @IsString()
  @IsOptional()
  password?: string;
}
