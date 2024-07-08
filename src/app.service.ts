import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getPlacesByCategory(categorySlug: string) {
    const isCategoryExist = await this.prismaService.category.findUnique({
      where: {
        slug: categorySlug,
      },
    });

    if (!isCategoryExist) throw new HttpException('Category not found!', 404);

    const places = await this.prismaService.categoriesOnPlace.findMany({
      where: {
        categoryId: isCategoryExist.id,
      },
      select: {
        place: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            description: true,
            longitude: true,
            latitude: true,
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
        },
      },
    });

    const formattedPlaces = places.map((item) => {
      const place = item.place;
      return {
        id: place.id,
        name: place.name,
        slug: place.slug,
        address: place.address,
        description: place.description,
        longitude: place.longitude,
        latitude: place.latitude,
        categories: place.categories.map((category) => ({
          name: category.category.name,
          slug: category.category.slug,
        })),
        images: place.images.map((image) => image.image),
      };
    });

    return formattedPlaces;
  }
}
