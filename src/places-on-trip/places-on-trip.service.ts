import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QueryPlacesOnTripDto } from './dtos/query-places-on-trip.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlacesOnTripService {
  constructor(private prismaService: PrismaService) {}

  async getAllPlacesOnTrip(tripId: string, query: QueryPlacesOnTripDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const placesOnTrip = await this.prismaService.placesOnTrip.findMany({
      skip,
      take,
      where: {
        tripId,
      },
      select: {
        id: true,
        place: { select: { id: true, name: true, slug: true } },
        trip: { select: { id: true, name: true } },
      },
    });

    const transformedResponse = Object.values(
      placesOnTrip.reduce((acc, item) => {
        const { place, trip } = item;
        const tripId = trip.id;

        if (!acc[tripId]) {
          acc[tripId] = {
            tripId: trip.id,
            tripoName: trip.name,
            placesOnTrip: [],
          };
        }

        acc[tripId].placesOnTrip.push({
          placesOnTripId: item.id,
          placeId: place.id,
          placeName: place.name,
          placeSlug: place.slug,
        });

        return acc;
      }, {}),
    );

    const placesOnTripCount = await this.prismaService.placesOnTrip.count({
      where: {
        tripId,
      },
    });

    return {
      placesOnTrip: transformedResponse,
      meta: {
        count: placesOnTripCount,
      },
    };
  }

  async addNewPlaceOnTrip(placeId: string, tripId: string) {
    const existingTrip = await this.prismaService.trip.findUnique({
      where: {
        id: tripId,
      },
    });
    if (!existingTrip) {
      throw new HttpException('Trip not found!', HttpStatus.BAD_REQUEST);
    }

    const existingPlace = await this.prismaService.place.findUnique({
      where: {
        id: placeId,
      },
    });
    if (!existingPlace) {
      throw new HttpException('Place not found!', HttpStatus.BAD_REQUEST);
    }

    const existingPlaceOnTrip = await this.prismaService.placesOnTrip.findMany({
      where: {
        AND: {
          placeId,
          tripId,
        },
      },
    });

    if (existingPlaceOnTrip.length > 0) {
      throw new HttpException(
        'One or more places already exist for this trip.',
        400,
      );
    }

    const newPlaceOnTrip = await this.prismaService.placesOnTrip.create({
      data: {
        placeId,
        tripId,
      },
    });

    return newPlaceOnTrip;
  }

  async deletePlaceOnTrip(id: string) {
    const existingPlaceOnTrip =
      await this.prismaService.placesOnTrip.findUnique({
        where: {
          id,
        },
      });
    if (!existingPlaceOnTrip) {
      throw new HttpException(
        'Category on place not found!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.placesOnTrip.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Successfully delete the place!',
      statusCode: 200,
    };
  }
}
