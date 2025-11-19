import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueueService } from '../common/queue/queue.service';
import { CreateExecutionDto, UpdateExecutionCaseDto } from './dto';

@Injectable()
export class ExecutionsService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async create(dto: CreateExecutionDto, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const execution = await this.prisma.execution.create({
      data: {
        productId: dto.productId,
        name: dto.name,
        description: dto.description,
        type: dto.type || 'standard',
        url: dto.url,
        status: 'pending',
      },
    });

    // Create execution cases for selected test cases
    if (dto.testCaseIds && dto.testCaseIds.length > 0) {
      await this.prisma.executionCase.createMany({
        data: dto.testCaseIds.map(testCaseId => ({
          executionId: execution.id,
          testCaseId,
        })),
      });
    }

    return execution;
  }

  async findOne(id: string, userId: string) {
    const execution = await this.prisma.execution.findUnique({
      where: { id },
      include: {
        product: true,
        cases: {
          include: {
            testCase: true,
            evidences: true,
          },
        },
      },
    });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    if (execution.product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return execution;
  }

  async updateCase(executionId: string, caseId: string, dto: UpdateExecutionCaseDto, userId: string) {
    const execution = await this.findOne(executionId, userId);

    const executionCase = await this.prisma.executionCase.findUnique({
      where: { id: caseId },
      include: { testCase: true },
    });

    if (!executionCase || executionCase.executionId !== executionId) {
      throw new NotFoundException('Execution case not found');
    }

    const updated = await this.prisma.executionCase.update({
      where: { id: caseId },
      data: {
        ...dto,
        executedAt: new Date(),
      },
    });

    // If failed, trigger AI bug logging
    if (dto.status === 'Failed') {
      await this.queueService.addBugAiJob({
        executionCaseId: caseId,
        testCase: executionCase.testCase,
        actualResult: dto.actualResult,
        productId: execution.productId,
        userId,
      });
    }

    return updated;
  }

  async uploadEvidence(executionId: string, executionCaseId: string, file: Express.Multer.File, userId: string) {
    await this.findOne(executionId, userId);

    const evidence = await this.prisma.evidence.create({
      data: {
        executionCaseId,
        fileName: file.originalname,
        fileUrl: file.path,
        fileType: file.mimetype,
        fileSize: file.size,
      },
    });

    return evidence;
  }
}