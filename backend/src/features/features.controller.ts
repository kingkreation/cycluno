import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FeaturesService } from './features.service';
import { UpdateFeatureDto } from './dto';

@ApiTags('Features')
@Controller('features')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeaturesController {
  constructor(private featuresService: FeaturesService) {}

  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string, @CurrentUser() user: any) {
    return this.featuresService.findByProduct(productId, user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFeatureDto, @CurrentUser() user: any) {
    return this.featuresService.update(id, dto, user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.featuresService.delete(id, user.id);
  }
}