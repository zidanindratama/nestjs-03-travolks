import { IsString } from 'class-validator';

export class AddCategoryToPlace {
  @IsString()
  placeId: string;

  @IsString()
  categoryId: string;
}
