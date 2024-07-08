import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryPlacesOnTripDto } from './dtos/query-places-on-trip.dto';
import { PlacesOnTripService } from './places-on-trip.service';
import { CreatePlaceOnTripDto } from './dtos/create-place-on-trip.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as RolesEnum } from '../users/enums/roles.enum';

@Controller('/protected/places-on-trip')
export class PlacesOnTripController {
  constructor(private placesOnTripService: PlacesOnTripService) {}

  @Get('/:tripId')
  getAllPlacesOnTrip(
    @Param('tripId') tripId: string,
    @Query() query: QueryPlacesOnTripDto,
  ) {
    return this.placesOnTripService.getAllPlacesOnTrip(tripId, query);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post()
  addNewPlaceOnTrip(@Body() body: CreatePlaceOnTripDto) {
    return this.placesOnTripService.addNewPlaceOnTrip(
      body.placeId,
      body.tripId,
    );
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:id')
  deleteCategoryOnPlace(@Param('id') id: string) {
    return this.placesOnTripService.deletePlaceOnTrip(id);
  }
}
