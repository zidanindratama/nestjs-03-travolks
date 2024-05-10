import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from '../users/users.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AccessControlService } from '../auth/shared/access-control.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [ProfileService, UsersService, AccessControlService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
