import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUsersDto } from './dtos/query-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles as RolesEnum } from './enums/roles.enum';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AccessTokenGuard)
@Controller('/protected/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(RolesEnum.ADMINISTRATOR, RolesEnum.TOUR_GUIDE)
  @UseGuards(RoleGuard)
  @Get()
  getAllUsers(@Query() query: QueryUsersDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new HttpException('User not found!', 404);
    return user;
  }

  @Get('/email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new HttpException('User not found!', 404);
    return user;
  }

  @Patch('/:id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserData: UpdateUserDto,
  ) {
    const user = this.getUserById(id);
    if (!user) throw new HttpException('User not found!', 404);
    return this.usersService.updateUserById(id, updateUserData);
  }

  @Roles(RolesEnum.ADMINISTRATOR)
  @UseGuards(RoleGuard)
  @Delete('/:id')
  deleteUserById(@Param('id') id: string) {
    const user = this.getUserById(id);
    if (!user) throw new HttpException('User not found!', 404);
    return this.usersService.deleteUserById(id);
  }
}
