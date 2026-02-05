import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';

@Controller('promo-code')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @Get()
  findAll() {
    return this.promoCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promoCodeService.findOne(+id);
  }

  @Post()
  create(@Body() createPromoCodeDto: any) {
    return this.promoCodeService.create(createPromoCodeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromoCodeDto: any) {
    return this.promoCodeService.update(+id, updatePromoCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promoCodeService.remove(+id);
  }

  @Post('validate')
  validate(@Body() data: { code: string; userId: number; courseId: number }) {
    return this.promoCodeService.validatePromoCode(data.code, data.userId, data.courseId);
  }
}
