import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUsersDto } from './dtos/query-users.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers(query: QueryUsersDto) {
    const pgNum = +(query.pgNum ?? 1);
    const pgSize = +(query.pgSize ?? 10);
    const skip = (pgNum - 1) * pgSize;
    const take = pgSize;

    const whereUser: Prisma.UserWhereInput = {};
    const whereProfile: Prisma.ProfileWhereInput = {};

    if (query.role) {
      whereUser.role = query.role;
    }

    if (query.fullname) {
      whereProfile.fullname = query.fullname;
    }

    if (query.gender) {
      whereProfile.gender = query.gender;
    }

    const user = await this.prismaService.user.findMany({
      where: whereUser,
      skip,
      take,
      select: {
        id: true,
        role: true,
        email: true,
        profile: {
          where: whereProfile,
        },
      },
    });

    const userCount = await this.prismaService.user.count();

    return {
      user,
      meta: {
        count: userCount,
      },
    };
  }

  getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        role: true,
        email: true,
        profile: {
          select: {
            id: true,
            fullname: true,
            gender: true,
            phoneNumber: true,
            address: true,
            image: true,
          },
        },
      },
    });
  }

  getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        profile: true,
      },
    });
  }

  createUser(createUserData: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: createUserData,
      select: {
        id: true,
        role: true,
        email: true,
        profile: {
          select: {
            id: true,
            fullname: true,
            gender: true,
            phoneNumber: true,
            address: true,
            image: true,
          },
        },
      },
    });
  }

  updateUserById(id: string, updateUserData: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: updateUserData,
      select: {
        id: true,
        role: true,
        email: true,
        profile: {
          select: {
            id: true,
            fullname: true,
            gender: true,
            phoneNumber: true,
            address: true,
            image: true,
          },
        },
      },
    });
  }

  async deleteUserById(id: string) {
    await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });

    return {
      message: 'Successfully delete the user!',
      statusCode: 200,
    };
  }
}
