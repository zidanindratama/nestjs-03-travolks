import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [TripsController],
  providers: [TripsService, AccessControlService],
  exports: [TripsService],
})
export class TripsModule {}
