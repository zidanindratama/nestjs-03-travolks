import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTripsDto } from './dtos/query-tips.dto';
import { Prisma } from '@prisma/client';

const slugify = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .trim();
};

@Injectable()
export class TripsService {
  constructor(private prismaService: PrismaService) {}

  async getAllTrips(query: QueryTripsDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const whereTrip: Prisma.TripWhereInput = {};

    if (query.name) {
      whereTrip.name = {
        contains: query.name,
        mode: 'insensitive',
      };
    }

    if (query.slug) {
      whereTrip.slug = {
        contains: query.slug,
        mode: 'insensitive',
      };
    }

    const trips = await this.prismaService.trip.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        startRegister: true,
        endRegister: true,
        startTrip: true,
        endTrip: true,
        image: true,
        tourGuide: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullname: true,
                gender: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        places: {
          select: {
            place: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const tripsCount = await this.prismaService.trip.count();

    const formattedTrips = trips.map((trip) => ({
      id: trip.id,
      name: trip.name,
      slug: trip.slug,
      description: trip.description,
      price: trip.price,
      registrationPeriod: {
        start: trip.startRegister,
        end: trip.endRegister,
      },
      tripPeriod: {
        start: trip.startTrip,
        end: trip.endTrip,
      },
      image: trip.image,
      tourGuide: {
        id: trip.tourGuide.id,
        email: trip.tourGuide.email,
        profile: {
          fullname: trip.tourGuide.profile.fullname,
          gender: trip.tourGuide.profile.gender,
          phoneNumber: trip.tourGuide.profile.phoneNumber,
          image: trip.tourGuide.profile.image,
        },
      },
      places: trip.places.map((placeObj) => ({
        id: placeObj.place.id,
        name: placeObj.place.name,
        slug: placeObj.place.slug,
        images: placeObj.place.images.map((imgObj) => imgObj.image.image),
      })),
    }));

    return {
      trips: formattedTrips,
      meta: {
        count: tripsCount,
      },
    };
  }

  async getTripBySlug(slug: string) {
    const trip = await this.prismaService.trip.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        startRegister: true,
        endRegister: true,
        startTrip: true,
        endTrip: true,
        image: true,
        tourGuide: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullname: true,
                gender: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        places: {
          select: {
            place: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedTrips = {
      id: trip.id,
      name: trip.name,
      slug: trip.slug,
      description: trip.description,
      price: trip.price,
      registrationPeriod: {
        start: trip.startRegister,
        end: trip.endRegister,
      },
      tripPeriod: {
        start: trip.startTrip,
        end: trip.endTrip,
      },
      image: trip.image,
      tourGuide: {
        id: trip.tourGuide.id,
        email: trip.tourGuide.email,
        profile: {
          fullname: trip.tourGuide.profile.fullname,
          gender: trip.tourGuide.profile.gender,
          phoneNumber: trip.tourGuide.profile.phoneNumber,
          image: trip.tourGuide.profile.image,
        },
      },
      places: trip.places.map((placeObj) => ({
        id: placeObj.place.id,
        name: placeObj.place.name,
        slug: placeObj.place.slug,
        images: placeObj.place.images.map((imgObj) => imgObj.image.image),
      })),
    };

    return {
      trip: formattedTrips,
    };
  }

  async createTrip(createTripData: Prisma.TripUncheckedCreateInput) {
    const slug = slugify(createTripData.name);
    const trip = await this.prismaService.trip.findUnique({
      where: {
        slug,
      },
    });
    if (trip) throw new HttpException('Trip already exist', 401);

    const newTrip = await this.prismaService.trip.create({
      data: {
        ...createTripData,
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        startRegister: true,
        endRegister: true,
        startTrip: true,
        endTrip: true,
        image: true,
        tourGuide: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullname: true,
                gender: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        places: {
          select: {
            place: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedTrips = {
      id: newTrip.id,
      name: newTrip.name,
      slug: newTrip.slug,
      description: newTrip.description,
      price: newTrip.price,
      registrationPeriod: {
        start: newTrip.startRegister,
        end: newTrip.endRegister,
      },
      tripPeriod: {
        start: newTrip.startTrip,
        end: newTrip.endTrip,
      },
      image: newTrip.image,
      tourGuide: {
        id: newTrip.tourGuide.id,
        email: newTrip.tourGuide.email,
        profile: {
          fullname: newTrip.tourGuide.profile.fullname,
          gender: newTrip.tourGuide.profile.gender,
          phoneNumber: newTrip.tourGuide.profile.phoneNumber,
          image: newTrip.tourGuide.profile.image,
        },
      },
      places: newTrip.places.map((placeObj) => ({
        id: placeObj.place.id,
        name: placeObj.place.name,
        slug: placeObj.place.slug,
        images: placeObj.place.images.map((imgObj) => imgObj.image.image),
      })),
    };

    return {
      trip: formattedTrips,
    };
  }

  async updateTripBySlug(
    slug: string,
    slugUpdate: string,
    updateTripData: Prisma.TripUncheckedUpdateInput,
  ) {
    const trip = await this.prismaService.trip.update({
      where: {
        slug,
      },
      data: {
        ...updateTripData,
        slug: slugUpdate,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        startRegister: true,
        endRegister: true,
        startTrip: true,
        endTrip: true,
        image: true,
        tourGuide: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullname: true,
                gender: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        places: {
          select: {
            place: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedTrips = {
      id: trip.id,
      name: trip.name,
      slug: trip.slug,
      description: trip.description,
      price: trip.price,
      registrationPeriod: {
        start: trip.startRegister,
        end: trip.endRegister,
      },
      tripPeriod: {
        start: trip.startTrip,
        end: trip.endTrip,
      },
      image: trip.image,
      tourGuide: {
        id: trip.tourGuide.id,
        email: trip.tourGuide.email,
        profile: {
          fullname: trip.tourGuide.profile.fullname,
          gender: trip.tourGuide.profile.gender,
          phoneNumber: trip.tourGuide.profile.phoneNumber,
          image: trip.tourGuide.profile.image,
        },
      },
      places: trip.places.map((placeObj) => ({
        id: placeObj.place.id,
        name: placeObj.place.name,
        slug: placeObj.place.slug,
        images: placeObj.place.images.map((imgObj) => imgObj.image.image),
      })),
    };

    return {
      trip: formattedTrips,
    };
  }

  async deleteTripBySlug(slug: string) {
    await this.prismaService.trip.delete({
      where: {
        slug,
      },
    });

    return {
      message: 'Successfully delete the trip!',
      statusCode: 200,
    };
  }
}
