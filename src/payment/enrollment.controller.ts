import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  findAll(@Query('isActive') isActive?: string) {
    if (isActive !== undefined) {
      return this.enrollmentService.findByStatus(isActive === 'true');
    }
    return this.enrollmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Post()
  create(@Body() createEnrollmentDto: any) {
    return this.enrollmentService.create(createEnrollmentDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentDto: any) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentService.remove(+id);
  }
}
