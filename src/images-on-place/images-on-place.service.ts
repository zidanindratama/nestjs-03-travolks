import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImagesOnPlaceService {
  constructor(private prismaService: PrismaService) {}

  async getAllImageOnPlace(placeId: string) {
    const place = await this.prismaService.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      throw new HttpException('Place not found!', 404);
    }

    const imagesOnPlace = await this.prismaService.imagesOnPlace.findMany({
      where: {
        placeId,
      },
      select: {
        id: true,
        place: { select: { id: true, name: true } },
        image: { select: { id: true, image: true } },
      },
    });

    // Group images by place
    const groupedImages = imagesOnPlace.reduce((acc, image) => {
      const { id, name } = image.place;
      if (!acc[id]) {
        acc[id] = { id, placeName: name, images: [] };
      }
      acc[id].images.push({
        imageId: image.image.id,
        imageUrl: image.image.image,
      });
      return acc;
    }, {});

    // Convert object to array
    const simplifiedResponse = Object.values(groupedImages);

    return simplifiedResponse;
  }

  async addNewImageOnPlace(placeId: string, image: string) {
    const place = await this.prismaService.place.findUnique({
      where: { id: placeId },
    });

    if (!place) throw new HttpException('Place not found!', 404);

    if (!image) throw new HttpException('Image required!', 400);

    const newImage = await this.prismaService.placeImages.create({
      data: {
        image,
        place: {
          create: {
            placeId: placeId,
          },
        },
      },
    });

    return newImage;
  }

  async deleteImageOnPlace(imageId: string) {
    const image = await this.prismaService.placeImages.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new HttpException('Image not found!', 404);
    }

    await this.prismaService.placeImages.delete({
      where: {
        id: imageId,
      },
    });

    return {
      message: 'Successfully delete the image!',
      statusCode: 200,
    };
  }
}
