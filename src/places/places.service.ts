import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryPlacesDto } from './dtos/query-places.dto';
import { CreatePlaceDto } from './dtos/create-place.dto';

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

    const formattedPlaces = places.map((place) => ({
      id: place.id,
      name: place.name,
      slug: place.slug,
      address: place.address,
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

  async createPlace(
    categoryIds: string[],
    createPlaceDto: CreatePlaceDto,
  ): Promise<any> {
    const { tourGuideId, name, longitude, latitude, image, address } =
      createPlaceDto;
    const existinngPlace = await this.prismaService.place.findUnique({
      where: {
        name,
      },
    });
    if (existinngPlace) throw new HttpException('Place already exist', 400);

    const place = await this.prismaService.place.create({
      data: {
        tourGuideId,
        name,
        slug: slugify(name),
        longitude,
        latitude,
        address,
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
        images: {
          create: [
            {
              image: {
                create: {
                  image,
                },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
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

  async getAllCategoryOnPlace(placeId: string, query: QueryPlacesDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const categoriesOnPlace =
      await this.prismaService.categoriesOnPlace.findMany({
        where: {
          placeId,
        },
        select: {
          id: true,
          place: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      });

    const categoriesOnPlaceCount =
      await this.prismaService.categoriesOnPlace.count({
        where: {
          placeId,
        },
      });

    const formattedCategoriesOnPlace = categoriesOnPlace.map((item) => ({
      id: item.id,
      placeName: item.place.name,
      categoryName: item.category.name,
    }));

    return {
      categoriesOnPlace: formattedCategoriesOnPlace,
      meta: {
        count: categoriesOnPlaceCount,
      },
    };
  }

  async addNewCategoryOnPlace(placeId: string, categoryId: string) {
    const existingPlace = await this.prismaService.place.findUnique({
      where: {
        id: placeId,
      },
    });
    if (!existingPlace) {
      throw new HttpException('Place not found!', HttpStatus.BAD_REQUEST);
    }

    const existingCategory = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!existingCategory) {
      throw new HttpException('Category not found!', HttpStatus.BAD_REQUEST);
    }

    const existingCategoriesOnPlace =
      await this.prismaService.categoriesOnPlace.findMany({
        where: {
          AND: {
            placeId,
            categoryId,
          },
        },
      });

    if (existingCategoriesOnPlace.length > 0) {
      throw new HttpException(
        'One or more categories already exist for this place.',
        400,
      );
    }

    const newCategoryOnPlace =
      await this.prismaService.categoriesOnPlace.create({
        data: {
          placeId,
          categoryId,
        },
      });

    return newCategoryOnPlace;
  }

  async updateCategoryOnPlace(
    id: string,
    placeId: string,
    newCategoryId: string,
  ) {
    const existingPlace = await this.prismaService.place.findUnique({
      where: {
        id: placeId,
      },
    });
    if (!existingPlace) {
      throw new HttpException('Place not found!', HttpStatus.BAD_REQUEST);
    }

    const existingCategory = await this.prismaService.category.findUnique({
      where: {
        id: newCategoryId,
      },
    });
    if (!existingCategory) {
      throw new HttpException('Category not found!', HttpStatus.BAD_REQUEST);
    }

    const existingCategoryOnPlace =
      await this.prismaService.categoriesOnPlace.findFirst({
        where: {
          placeId,
          categoryId: newCategoryId,
        },
      });
    if (existingCategoryOnPlace) {
      throw new HttpException(
        'Category already exists for this place.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedCategoryOnPlace =
      await this.prismaService.categoriesOnPlace.update({
        where: {
          id,
        },
        data: {
          categoryId: newCategoryId,
          placeId,
        },
      });

    return updatedCategoryOnPlace;
  }

  async deleteCategoryOnPlace(id: string) {
    const existingCategoryOnPlace =
      await this.prismaService.categoriesOnPlace.findUnique({
        where: {
          id,
        },
      });
    if (!existingCategoryOnPlace) {
      throw new HttpException(
        'Category on place not found!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.categoriesOnPlace.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Successfully delete the category!',
      statusCode: 200,
    };
  }
}
