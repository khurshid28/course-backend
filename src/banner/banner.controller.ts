import { Controller, Get, Param } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getActiveBanners() {
    return this.bannerService.getActiveBanners();
  }

  @Get(':id')
  async getBannerById(@Param('id') id: string) {
    return this.bannerService.getBannerById(+id);
  }
}
