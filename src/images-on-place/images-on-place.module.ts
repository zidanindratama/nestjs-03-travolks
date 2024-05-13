import { Module } from '@nestjs/common';
import { ImagesOnPlaceService } from './images-on-place.service';
import { ImagesOnPlaceController } from './images-on-place.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [ImagesOnPlaceService, AccessControlService],
  controllers: [ImagesOnPlaceController],
  exports: [ImagesOnPlaceService],
})
export class ImagesOnPlaceModule {}
