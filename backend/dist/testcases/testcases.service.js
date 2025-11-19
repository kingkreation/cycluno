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
exports.TestCasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let TestCasesService = class TestCasesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(productId, featureId, userId) {
        const where = {};
        if (productId) {
            const product = await this.prisma.product.findUnique({ where: { id: productId } });
            if (product && product.userId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
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
    async findOne(id, userId) {
        const testCase = await this.prisma.testCase.findUnique({
            where: { id },
            include: {
                feature: true,
                product: true,
            },
        });
        if (!testCase) {
            throw new common_1.NotFoundException('Test case not found');
        }
        if (testCase.product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return testCase;
    }
    async create(dto, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product || product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
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
    async update(id, dto, userId) {
        const testCase = await this.findOne(id, userId);
        return this.prisma.testCase.update({
            where: { id },
            data: dto,
        });
    }
    async delete(id, userId) {
        await this.findOne(id, userId);
        await this.prisma.testCase.delete({ where: { id } });
        return { message: 'Test case deleted successfully' };
    }
};
exports.TestCasesService = TestCasesService;
exports.TestCasesService = TestCasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestCasesService);
//# sourceMappingURL=testcases.service.js.map