import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesModule } from './categories/categories.module';
import { PlacesModule } from './places/places.module';
import { CategoriesOnPlaceModule } from './categories-on-place/categories-on-place.module';
import { ImagesOnPlaceModule } from './images-on-place/images-on-place.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    CloudinaryModule,
    CategoriesModule,
    PlacesModule,
    CategoriesOnPlaceModule,
    ImagesOnPlaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
