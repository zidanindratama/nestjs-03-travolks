import { Module } from '@nestjs/common';
import { CategoriesOnPlaceService } from './categories-on-place.service';
import { CategoriesOnPlaceController } from './categories-on-place.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesOnPlaceService, AccessControlService],
  controllers: [CategoriesOnPlaceController],
  exports: [CategoriesOnPlaceService],
})
export class CategoriesOnPlaceModule {}
