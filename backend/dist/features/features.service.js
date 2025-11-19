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
exports.FeaturesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let FeaturesService = class FeaturesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByProduct(productId, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.feature.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, dto, userId) {
        const feature = await this.prisma.feature.findUnique({
            where: { id },
            include: { product: true },
        });
        if (!feature) {
            throw new common_1.NotFoundException('Feature not found');
        }
        if (feature.product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.feature.update({
            where: { id },
            data: dto,
        });
    }
    async delete(id, userId) {
        const feature = await this.prisma.feature.findUnique({
            where: { id },
            include: { product: true },
        });
        if (!feature) {
            throw new common_1.NotFoundException('Feature not found');
        }
        if (feature.product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.feature.delete({ where: { id } });
        return { message: 'Feature deleted successfully' };
    }
};
exports.FeaturesService = FeaturesService;
exports.FeaturesService = FeaturesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeaturesService);
//# sourceMappingURL=features.service.js.map