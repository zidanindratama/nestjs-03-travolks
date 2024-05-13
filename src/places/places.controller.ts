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
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dtos/create-place.dto';
import { QueryPlacesDto } from './dtos/query-places.dto';
import { UpdatePlaceDto } from './dtos/update-place.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as RolesEnum } from '../users/enums/roles.enum';

@Controller('/protected/places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get()
  getAllPlaces(@Query() query: QueryPlacesDto) {
    return this.placesService.getAllPlaces(query);
  }

  @Get('/:slug')
  getPlaceByPlaceSlug(@Param('slug') slug: string) {
    return this.placesService.getPlaceByPlaceSlug(slug);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post()
  createPlace(@Body() body: CreatePlaceDto) {
    return this.placesService.createPlace(body);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch('/:slug')
  updatePlaceByPlaceSlug(
    @Param('slug') slug: string,
    @Body() body: UpdatePlaceDto,
  ) {
    return this.placesService.updatePlaceByPlaceSlug(slug, body);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:id')
  deletePlaceByPlaceSlug(@Param('slug') slug: string) {
    return this.placesService.deletePlaceByPlaceSlug(slug);
  }
}
