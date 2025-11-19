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
exports.ExecutionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const queue_service_1 = require("../common/queue/queue.service");
let ExecutionsService = class ExecutionsService {
    constructor(prisma, queueService) {
        this.prisma = prisma;
        this.queueService = queueService;
    }
    async create(dto, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product || product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Execution not found');
        }
        if (execution.product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return execution;
    }
    async updateCase(executionId, caseId, dto, userId) {
        const execution = await this.findOne(executionId, userId);
        const executionCase = await this.prisma.executionCase.findUnique({
            where: { id: caseId },
            include: { testCase: true },
        });
        if (!executionCase || executionCase.executionId !== executionId) {
            throw new common_1.NotFoundException('Execution case not found');
        }
        const updated = await this.prisma.executionCase.update({
            where: { id: caseId },
            data: {
                ...dto,
                executedAt: new Date(),
            },
        });
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
    async uploadEvidence(executionId, executionCaseId, file, userId) {
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
};
exports.ExecutionsService = ExecutionsService;
exports.ExecutionsService = ExecutionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], ExecutionsService);
//# sourceMappingURL=executions.service.js.map