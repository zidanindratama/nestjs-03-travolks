import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessControlService } from '../auth/shared/access-control.service';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [PrismaModule, ProfileModule],
  providers: [UsersService, AccessControlService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
