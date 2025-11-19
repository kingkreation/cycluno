"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProductReport(productId, featureId, priority, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product || product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const where = { productId };
        if (featureId)
            where.featureId = featureId;
        if (priority)
            where.priority = priority;
        const totalTestCases = await this.prisma.testCase.count({ where });
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
        const totalBugs = await this.prisma.bug.count({ where: { productId } });
        const openBugs = await this.prisma.bug.count({
            where: { productId, status: { not: 'Fixed' } },
        });
        const fixedBugs = await this.prisma.bug.count({
            where: { productId, status: 'Fixed' },
        });
        const priorityBreakdown = await this.prisma.testCase.groupBy({
            by: ['priority'],
            where,
            _count: true,
        });
        const featureBreakdown = await this.prisma.testCase.groupBy({
            by: ['featureId'],
            where: { productId },
            _count: true,
        });
        const featureDetails = await Promise.all(featureBreakdown.map(async (item) => {
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
        }));
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map