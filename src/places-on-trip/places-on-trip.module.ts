import { Module } from '@nestjs/common';
import { PlacesOnTripController } from './places-on-trip.controller';
import { PlacesOnTripService } from './places-on-trip.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlacesOnTripController],
  providers: [PlacesOnTripService, AccessControlService],
  exports: [PlacesOnTripService],
})
export class PlacesOnTripModule {}
