import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTestCaseDto, UpdateTestCaseDto } from './dto';

@Injectable()
export class TestCasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(productId?: string, featureId?: string, userId?: string) {
    const where: any = {};
    
    if (productId) {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (product && product.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }
      where.productId = productId;
    }
    
    if (featureId) {
      where.featureId = featureId;
    }

    return this.prisma.testCase.findMany({
      where,
      include: {
        feature: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const testCase = await this.prisma.testCase.findUnique({
      where: { id },
      include: {
        feature: true,
        product: true,
      },
    });

    if (!testCase) {
      throw new NotFoundException('Test case not found');
    }

    if (testCase.product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return testCase;
  }

  async create(dto: CreateTestCaseDto, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Generate test case ID
    const count = await this.prisma.testCase.count({
      where: { productId: dto.productId },
    });
    const testCaseId = `TC-${String(count + 1).padStart(3, '0')}`;

    return this.prisma.testCase.create({
      data: {
        ...dto,
        testCaseId,
        loggedBy: userId,
      },
    });
  }

  async update(id: string, dto: UpdateTestCaseDto, userId: string) {
    const testCase = await this.findOne(id, userId);

    return this.prisma.testCase.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.testCase.delete({ where: { id } });
    return { message: 'Test case deleted successfully' };
  }
}