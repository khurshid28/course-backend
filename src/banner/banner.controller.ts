import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('banner')
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

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBanner(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.createBanner(createBannerDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateBanner(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannerService.updateBanner(+id, updateBannerDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async patchBanner(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannerService.updateBanner(+id, updateBannerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBanner(@Param('id') id: string) {
    return this.bannerService.deleteBanner(+id);
  }
}
