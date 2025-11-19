import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto, AddManualFeaturesDto } from './dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.productsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.findOne(id, user.id);
  }

  @Post()
  async create(@Body() dto: CreateProductDto, @CurrentUser() user: any) {
    return this.productsService.create(dto, user.id);
  }

  @Post(':id/features/manual')
  async addManualFeatures(
    @Param('id') id: string,
    @Body() dto: AddManualFeaturesDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.addManualFeatures(id, dto.features, user.id);
  }

  @Post(':id/features/upload-prd')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadPRD(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.productsService.uploadPRD(id, file, user.id);
  }

  @Post(':id/generate-testcases')
  async generateTestCases(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.generateTestCases(id, user.id);
  }
}