import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/places-by-category/:slug')
  getPlacesByCategory(@Param('slug') slug: string) {
    return this.appService.getPlacesByCategory(slug);
  }
}
