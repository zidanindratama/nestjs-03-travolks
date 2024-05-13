import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesOnPlaceService } from './images-on-place.service';
import { AddNewImageOnPlace } from './dtos/add-new-image-on-place.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as RolesEnum } from '../users/enums/roles.enum';

@Controller('/protected/images-on-place')
export class ImagesOnPlaceController {
  constructor(
    private imagesOnPlaceService: ImagesOnPlaceService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('/:placeId')
  getAllImageOnPlace(@Param('placeId') placeId: string) {
    return this.imagesOnPlaceService.getAllImageOnPlace(placeId);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Post('/:placeId')
  @UseInterceptors(FileInterceptor('image'))
  async addNewImageOnPlace(
    @Param('placeId') placeId: string,
    @Body() body: AddNewImageOnPlace,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      const uploadedImage = await this.cloudinaryService.uploadFile(image);
      body.image = uploadedImage.secure_url;
    }
    return this.imagesOnPlaceService.addNewImageOnPlace(placeId, body.image);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Delete('/:imageId')
  deleteImageOnPlace(@Param('imageId') imageId: string) {
    return this.imagesOnPlaceService.deleteImageOnPlace(imageId);
  }
}
