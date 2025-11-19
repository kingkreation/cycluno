import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueueService } from '../common/queue/queue.service';
import { CreateProductDto } from './dto';
import * as fs from 'fs';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async findAll(userId: string) {
    const products = await this.prisma.product.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            features: true,
            testCases: true,
            bugs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(product => ({
      ...product,
      featureCount: product._count.features,
      testCaseCount: product._count.testCases,
      bugCount: product._count.bugs,
    }));
  }

  async findOne(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        features: true,
        _count: {
          select: {
            testCases: true,
            bugs: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return product;
  }

  async create(dto: CreateProductDto, userId: string) {
    return this.prisma.product.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async addManualFeatures(productId: string, features: any[], userId: string) {
    const product = await this.findOne(productId, userId);

    const createdFeatures = await this.prisma.feature.createMany({
      data: features.map(f => ({
        ...f,
        productId,
        source: 'manual',
      })),
    });

    return { message: 'Features added successfully', count: createdFeatures.count };
  }

  async uploadPRD(productId: string, file: Express.Multer.File, userId: string) {
    const product = await this.findOne(productId, userId);

    const prdContent = fs.readFileSync(file.path, 'utf-8');

    // Queue PRD parsing job
    await this.queueService.addPRDParsingJob({
      productId,
      prdContent,
      filePath: file.path,
    });

    return { message: 'PRD uploaded. Feature extraction in progress...' };
  }

  async generateTestCases(productId: string, userId: string) {
    const product = await this.findOne(productId, userId);

    const features = await this.prisma.feature.findMany({
      where: { productId },
    });

    if (features.length === 0) {
      throw new NotFoundException('No features found for this product');
    }

    // Queue test case generation for each feature
    for (const feature of features) {
      await this.queueService.addTestCaseGenerationJob({
        productId,
        featureId: feature.id,
        featureName: feature.name,
        featureDescription: feature.description,
        userId,
      });
    }

    return { message: 'Test case generation started', featureCount: features.length };
  }
}