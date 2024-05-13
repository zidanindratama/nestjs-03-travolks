import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QueryPlacesDto } from '../places/dtos/query-places.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesOnPlaceService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategoryOnPlace(placeId: string, query: QueryPlacesDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const categoriesOnPlace =
      await this.prismaService.categoriesOnPlace.findMany({
        skip,
        take,
        where: {
          placeId,
        },
        select: {
          id: true,
          place: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
        },
      });

    const transformedResponse = Object.values(
      categoriesOnPlace.reduce((acc, item) => {
        const { place, category } = item;
        const placeId = place.id;

        if (!acc[placeId]) {
          acc[placeId] = {
            placeId: place.id,
            placeName: place.name,
            categoriesOnPlace: [],
          };
        }

        acc[placeId].categoriesOnPlace.push({
          categoryOnPlaceId: item.id,
          categoryId: category.id,
          categoryName: category.name,
        });

        return acc;
      }, {}),
    );

    const categoriesOnPlaceCount =
      await this.prismaService.categoriesOnPlace.count({
        where: {
          placeId,
        },
      });

    return {
      categoriesOnPlace: transformedResponse,
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
