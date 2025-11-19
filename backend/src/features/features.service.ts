import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateFeatureDto } from './dto';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.feature.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateFeatureDto, userId: string) {
    const feature = await this.prisma.feature.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    if (feature.product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.feature.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const feature = await this.prisma.feature.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    if (feature.product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.feature.delete({ where: { id } });
    return { message: 'Feature deleted successfully' };
  }
}