import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getProductReport(productId: string, featureId?: string, priority?: string, userId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const where: any = { productId };
    if (featureId) where.featureId = featureId;
    if (priority) where.priority = priority;

    // Total test cases
    const totalTestCases = await this.prisma.testCase.count({ where });

    // Execution statistics
    const executionCases = await this.prisma.executionCase.findMany({
      where: {
        testCase: where,
      },
      select: {
        status: true,
      },
    });

    const executed = executionCases.length;
    const passed = executionCases.filter(ec => ec.status === 'Passed').length;
    const failed = executionCases.filter(ec => ec.status === 'Failed').length;
    const pending = executionCases.filter(ec => ec.status === 'Pending').length;
    const successRate = executed > 0 ? ((passed / executed) * 100).toFixed(2) : '0.00';

    // Bug statistics
    const totalBugs = await this.prisma.bug.count({ where: { productId } });
    const openBugs = await this.prisma.bug.count({
      where: { productId, status: { not: 'Fixed' } },
    });
    const fixedBugs = await this.prisma.bug.count({
      where: { productId, status: 'Fixed' },
    });

    // Priority breakdown
    const priorityBreakdown = await this.prisma.testCase.groupBy({
      by: ['priority'],
      where,
      _count: true,
    });

    // Test cases by feature
    const featureBreakdown = await this.prisma.testCase.groupBy({
      by: ['featureId'],
      where: { productId },
      _count: true,
    });

    const featureDetails = await Promise.all(
      featureBreakdown.map(async (item) => {
        const feature = item.featureId
          ? await this.prisma.feature.findUnique({
              where: { id: item.featureId },
              select: { name: true },
            })
          : null;
        return {
          featureName: feature?.name || 'Unassigned',
          count: item._count,
        };
      }),
    );

    // Execution trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentExecutions = await this.prisma.execution.findMany({
      where: {
        productId,
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        cases: {
          select: {
            status: true,
            executedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const executionTrend = recentExecutions.map(execution => ({
      date: execution.createdAt.toISOString().split('T')[0],
      passed: execution.cases.filter(c => c.status === 'Passed').length,
      failed: execution.cases.filter(c => c.status === 'Failed').length,
      pending: execution.cases.filter(c => c.status === 'Pending').length,
    }));

    return {
      summary: {
        totalTestCases,
        executed,
        passed,
        failed,
        pending,
        successRate: parseFloat(successRate),
        totalBugs,
        openBugs,
        fixedBugs,
      },
      priorityBreakdown,
      featureBreakdown: featureDetails,
      executionTrend,
    };
  }
}