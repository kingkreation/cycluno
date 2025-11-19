"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const queue_service_1 = require("../common/queue/queue.service");
const fs = __importStar(require("fs"));
let ProductsService = class ProductsService {
    constructor(prisma, queueService) {
        this.prisma = prisma;
        this.queueService = queueService;
    }
    async findAll(userId) {
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return product;
    }
    async create(dto, userId) {
        return this.prisma.product.create({
            data: {
                ...dto,
                userId,
            },
        });
    }
    async addManualFeatures(productId, features, userId) {
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
    async uploadPRD(productId, file, userId) {
        const product = await this.findOne(productId, userId);
        const prdContent = fs.readFileSync(file.path, 'utf-8');
        await this.queueService.addPRDParsingJob({
            productId,
            prdContent,
            filePath: file.path,
        });
        return { message: 'PRD uploaded. Feature extraction in progress...' };
    }
    async generateTestCases(productId, userId) {
        const product = await this.findOne(productId, userId);
        const features = await this.prisma.feature.findMany({
            where: { productId },
        });
        if (features.length === 0) {
            throw new common_1.NotFoundException('No features found for this product');
        }
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], ProductsService);
//# sourceMappingURL=products.service.js.map