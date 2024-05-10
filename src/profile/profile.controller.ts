import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UsersService } from '../users/users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('/protected/profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('/user/:id')
  async getProfileByUserId(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) return new HttpException('User not found!', 404);
    return this.profileService.getProfilebyUserId(id);
  }

  @Patch('/user/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileByUserId(
    @Param('id') id: string,
    @Body() body: UpdateProfileDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      const uploadedImage = await this.cloudinaryService.uploadFile(image);
      body.image = uploadedImage.secure_url;
    }
    const user = await this.usersService.getUserById(id);
    if (!user) return new HttpException('User not found!', 404);
    return this.profileService.updateProfileByUserId(id, body);
  }
}
