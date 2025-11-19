import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TestCasesService } from './testcases.service';
import { CreateTestCaseDto, UpdateTestCaseDto } from './dto';

@ApiTags('Test Cases')
@Controller('testcases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestCasesController {
  constructor(private testCasesService: TestCasesService) {}

  @Get()
  async findAll(
    @Query('productId') productId: string,
    @Query('featureId') featureId: string,
    @CurrentUser() user: any,
  ) {
    return this.testCasesService.findAll(productId, featureId, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.testCasesService.findOne(id, user.id);
  }

  @Post()
  async create(@Body() dto: CreateTestCaseDto, @CurrentUser() user: any) {
    return this.testCasesService.create(dto, user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTestCaseDto, @CurrentUser() user: any) {
    return this.testCasesService.update(id, dto, user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.testCasesService.delete(id, user.id);
  }
}