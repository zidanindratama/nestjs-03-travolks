import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TripsService } from './trips.service';
import { QueryTripsDto } from './dtos/query-tips.dto';
import { CreateTripDto } from './dtos/create-trip.dto';
import { UpdateTripDto } from './dtos/update-trip.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as RolesEnum } from '../users/enums/roles.enum';

const slugify = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .trim();
};

@Controller('/protected/trips')
export class TripsController {
  constructor(
    private tripsService: TripsService,
    private prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAllTrips(@Query() query: QueryTripsDto) {
    return this.tripsService.getAllTrips(query);
  }

  @Get('/:slug')
  async getTripsBySlug(@Param('slug') slug: string) {
    const trip = await this.tripsService.getTripBySlug(slug);
    if (!trip) throw new HttpException('Trip not found!', 404);
    return trip;
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createTrip(
    @Body() body: CreateTripDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      const uploadedImage = await this.cloudinaryService.uploadFile(image);
      body.image = uploadedImage.secure_url;
    }

    const { price, ...rest } = body;
    const toFloatProce = parseFloat(price);
    return this.tripsService.createTrip({ ...rest, price: toFloatProce });
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Patch('/:slug')
  @UseInterceptors(FileInterceptor('image'))
  async updateTripBySkug(
    @Param('slug') slug: string,
    @Body() body: UpdateTripDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      const uploadedImage = await this.cloudinaryService.uploadFile(image);
      body.image = uploadedImage.secure_url;
    }

    const trip = await this.prismaService.trip.findUnique({
      where: { slug },
    });
    if (!trip) throw new HttpException('Trip not ound!', 404);

    const slugUpdate = slugify(body.name);
    const { price, ...rest } = body;
    const toFloatProce = parseFloat(price);

    return this.tripsService.updateTripBySlug(slug, slugUpdate, {
      ...rest,
      price: toFloatProce,
    });
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:slug')
  async deleteTripBySlug(@Param('slug') slug: string) {
    const trip = await this.prismaService.trip.findUnique({
      where: { slug },
    });
    if (!trip) throw new HttpException('Trip not found!', 404);
    return this.tripsService.deleteTripBySlug(slug);
  }
}
