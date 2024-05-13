import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesOnPlaceService } from './categories-on-place.service';
import { AddCategoryToPlace } from './dtos/add-category-to-place.dto';
import { QueryPlacesDto } from '../places/dtos/query-places.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as RolesEnum } from '../users/enums/roles.enum';

@Controller('/protected/categories-on-place')
export class CategoriesOnPlaceController {
  constructor(private categoriesOnPlaceService: CategoriesOnPlaceService) {}

  @Get('/:placeId')
  getAllCategoryOnPlace(
    @Param('placeId') placeId: string,
    @Query() query: QueryPlacesDto,
  ) {
    return this.categoriesOnPlaceService.getAllCategoryOnPlace(placeId, query);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post()
  addNewCategoryOnPlace(@Body() body: AddCategoryToPlace) {
    return this.categoriesOnPlaceService.addNewCategoryOnPlace(
      body.placeId,
      body.categoryId,
    );
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch('/:id')
  updateCategoryOnPlace(@Param('id') id: string, @Body() body: any) {
    return this.categoriesOnPlaceService.updateCategoryOnPlace(
      id,
      body.placeId,
      body.newCategoryId,
    );
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:id')
  deleteCategoryOnPlace(@Param('id') id: string) {
    return this.categoriesOnPlaceService.deleteCategoryOnPlace(id);
  }
}
