import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get(':productId')
  async getProductReport(
    @Param('productId') productId: string,
    @Query('featureId') featureId: string,
    @Query('priority') priority: string,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.getProductReport(productId, featureId, priority, user.id);
  }
}