import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BugsService } from './bugs.service';
import { CreateBugDto, UpdateBugDto, AddCommentDto } from './dto';

@ApiTags('Bugs')
@Controller('bugs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BugsController {
  constructor(private bugsService: BugsService) {}

  @Get()
  async findAll(
    @Query('productId') productId: string,
    @Query('status') status: string,
    @Query('priority') priority: string,
    @CurrentUser() user: any,
  ) {
    return this.bugsService.findAll(productId, status, priority, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bugsService.findOne(id, user.id);
  }

  @Post()
  async create(@Body() dto: CreateBugDto, @CurrentUser() user: any) {
    return this.bugsService.create(dto, user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBugDto, @CurrentUser() user: any) {
    return this.bugsService.update(id, dto, user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: any,
  ) {
    return this.bugsService.updateStatus(id, status, user.id);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() dto: AddCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.bugsService.addComment(id, dto, user.id);
  }
}