import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dtos/create-place.dto';
import { QueryPlacesDto } from './dtos/query-places.dto';
import { AddCategoryToPlace } from './dtos/add-category-to-place.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('/protected/places')
export class PlacesController {
  constructor(
    private placesService: PlacesService,
    private prismService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllPlaces(@Query() query: QueryPlacesDto) {
    return this.placesService.getAllPlaces(query);
  }

  @Get('/category-on-place/:placeId')
  getAllCategoryOnPlace(
    @Param('placeId') placeId: string,
    @Query() query: QueryPlacesDto,
  ) {
    return this.placesService.getAllCategoryOnPlace(placeId, query);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPlace(
    @Body() body: CreatePlaceDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      const uploadedImage = await this.cloudinaryService.uploadFile(image);
      body.image = uploadedImage.secure_url;
    }
    // @ts-ignore
    const dataArray = JSON.parse(body.categoryIds);
    return this.placesService.createPlace(dataArray, body);
  }

  @Post('/category-on-place')
  addNewCategoryOnPlace(@Body() body: AddCategoryToPlace) {
    return this.placesService.addNewCategoryOnPlace(
      body.placeId,
      body.categoryId,
    );
  }

  @Patch('/category-on-place/:id')
  updateCategoryOnPlace(@Param('id') id: string, @Body() body: any) {
    return this.placesService.updateCategoryOnPlace(
      id,
      body.placeId,
      body.newCategoryId,
    );
  }

  @Delete('/category-on-place/:id')
  deleteCategoryOnPlace(@Param('id') id: string) {
    return this.placesService.deleteCategoryOnPlace(id);
  }
}
