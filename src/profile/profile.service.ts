import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  getProfilebyUserId(userId: string) {
    return this.prismaService.profile.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  updateProfileByUserId(
    userId: string,
    updateProfileByUserIdData: Prisma.ProfileUpdateInput,
  ) {
    return this.prismaService.profile.update({
      where: {
        userId: userId,
      },
      data: updateProfileByUserIdData,
    });
  }
}
