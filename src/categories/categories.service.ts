import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QueryCategoriesDto } from './dtos/query-categories.dto';
import { PrismaService } from '../prisma/prisma.service';

const slugify = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .trim();
};

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategories(query: QueryCategoriesDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const whereCategory: Prisma.CategoryWhereInput = {};

    if (query.name) {
      whereCategory.name = query.name;
    }

    if (query.slug) {
      whereCategory.slug = query.slug;
    }

    const categories = await this.prismaService.category.findMany({
      skip,
      take,
    });

    return categories;
  }

  getCategoryBySlug(slug: string) {
    return this.prismaService.category.findUnique({
      where: {
        slug,
      },
    });
  }

  async createCategory(createCategoryData: Prisma.CategoryCreateInput) {
    const slug = slugify(createCategoryData.name);
    const category = await this.getCategoryBySlug(slug);
    if (category) throw new HttpException('Category already exist!', 401);

    return this.prismaService.category.create({
      data: {
        ...createCategoryData,
        slug,
      },
    });
  }

  updateCategoryBySlug(
    slug: string,
    slugUpdate: string,
    updateCategoryByIdData: Prisma.CategoryUpdateInput,
  ) {
    return this.prismaService.category.update({
      where: {
        slug,
      },
      data: {
        ...updateCategoryByIdData,
        slug: slugUpdate,
      },
    });
  }

  async deleteCategoryBySlug(slug: string) {
    await this.prismaService.category.delete({
      where: {
        slug,
      },
    });

    return {
      message: 'Successfully delete the category!',
      statusCode: 200,
    };
  }
}
