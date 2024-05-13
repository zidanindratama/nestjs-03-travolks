import { IsString } from 'class-validator';

export class AddNewImageOnPlace {
  @IsString()
  image: string;
}
