import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryPlacesDto } from './dtos/query-places.dto';
import { Prisma } from '@prisma/client';

const slugify = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .trim();
};

@Injectable()
export class PlacesService {
  constructor(private prismaService: PrismaService) {}

  async getAllPlaces(query: QueryPlacesDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const places = await this.prismaService.place.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        description: true,
        longitude: true,
        latitude: true,
        tourGuide: {
          select: {
            email: true,
            profile: {
              select: {
                id: true,
                gender: true,
                fullname: true,
                address: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        categories: {
          select: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            image: true,
          },
        },
      },
    });

    const formattedPlaces = places.map((place) => ({
      id: place.id,
      name: place.name,
      slug: place.slug,
      address: place.address,
      description: place.description,
      longitude: place.longitude,
      latitude: place.latitude,
      tourGuideEmail: place.tourGuide.email,
      tourGuideProfile: place.tourGuide.profile,
      categories: place.categories.map((category) => ({
        name: category.category.name,
        slug: category.category.slug,
      })),
      images: place.images.map((image) => image.image.image),
    }));

    const placesCount = await this.prismaService.place.count();

    return {
      places: formattedPlaces,
      meta: {
        count: placesCount,
      },
    };
  }

  async getPlaceByPlaceSlug(slug: string) {
    const place = await this.prismaService.place.findFirst({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        description: true,
        longitude: true,
        latitude: true,
        tourGuide: {
          select: {
            email: true,
            profile: {
              select: {
                id: true,
                gender: true,
                fullname: true,
                address: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        categories: {
          select: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        images: {
          select: {
            image: true,
          },
        },
      },
    });

    if (!place) throw new HttpException('Place not found!', 404);

    const formattedPlaces = {
      id: place.id,
      name: place.name,
      slug: place.slug,
      address: place.address,
      description: place.description,
      longitude: place.longitude,
      latitude: place.latitude,
      tourGuideEmail: place.tourGuide.email,
      tourGuideProfile: place.tourGuide.profile,
      categories: place.categories.map((category) => ({
        name: category.category.name,
        slug: category.category.slug,
      })),
      images: place.images.map((image) => image.image.image),
    };

    return formattedPlaces;
  }

  async createPlace(createPlaceData: Prisma.PlaceUncheckedCreateInput) {
    const existinngPlace = await this.prismaService.place.findUnique({
      where: {
        name: createPlaceData.name,
      },
    });
    if (existinngPlace) throw new HttpException('Place already exist', 400);

    const place = await this.prismaService.place.create({
      data: {
        tourGuideId: createPlaceData.tourGuideId,
        name: createPlaceData.name,
        slug: slugify(createPlaceData.name),
        description: createPlaceData.description,
        longitude: createPlaceData.longitude,
        latitude: createPlaceData.latitude,
        address: createPlaceData.address,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        description: true,
        longitude: true,
        latitude: true,
        tourGuide: {
          select: {
            email: true,
            profile: {
              select: {
                id: true,
                gender: true,
                fullname: true,
                address: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        images: {
          select: {
            image: true,
          },
        },
      },
    });

    const formattedPlaces = {
      id: place.id,
      name: place.name,
      slug: place.slug,
      address: place.address,
      description: place.description,
      longitude: place.longitude,
      latitude: place.latitude,
      tourGuideEmail: place.tourGuide.email,
      tourGuideProfile: place.tourGuide.profile,
      categories: place.categories.map((category) => ({
        id: category.category.id,
        name: category.category.name,
        slug: category.category.slug,
      })),
      images: place.images.map((image) => image.image.image),
    };

    return formattedPlaces;
  }

  async updatePlaceByPlaceSlug(
    slug: string,
    updatePlaceData: Prisma.PlaceUncheckedUpdateInput,
  ) {
    const place = await this.prismaService.place.findFirst({
      where: {
        slug,
      },
    });

    if (!place) throw new HttpException('Place not found!', 404);

    const updatedPlace = await this.prismaService.place.update({
      where: {
        id: place.id,
      },
      data: updatePlaceData,
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        description: true,
        longitude: true,
        latitude: true,
        tourGuide: {
          select: {
            email: true,
            profile: {
              select: {
                id: true,
                gender: true,
                fullname: true,
                address: true,
                phoneNumber: true,
                image: true,
              },
            },
          },
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        images: {
          select: {
            image: true,
          },
        },
      },
    });

    const formattedPlaces = {
      id: updatedPlace.id,
      name: updatedPlace.name,
      slug: updatedPlace.slug,
      address: updatedPlace.address,
      description: updatedPlace.description,
      longitude: updatedPlace.longitude,
      latitude: updatedPlace.latitude,
      tourGuideEmail: updatedPlace.tourGuide.email,
      tourGuideProfile: updatedPlace.tourGuide.profile,
      categories: updatedPlace.categories.map((category) => ({
        id: category.category.id,
        name: category.category.name,
        slug: category.category.slug,
      })),
      images: updatedPlace.images.map((image) => image.image.image),
    };

    return formattedPlaces;
  }

  async deletePlaceByPlaceSlug(slug: string) {
    const place = await this.prismaService.place.findFirst({
      where: {
        slug,
      },
    });

    if (!place) throw new HttpException('Place not found!', 404);

    await this.prismaService.place.delete({
      where: {
        id: place.id,
      },
    });

    return {
      message: 'Successfully delete the place!',
      statusCode: 200,
    };
  }
}
