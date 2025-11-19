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
exports.BugsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let BugsService = class BugsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(productId, status, priority, userId) {
        const where = {};
        if (productId) {
            const product = await this.prisma.product.findUnique({ where: { id: productId } });
            if (product && product.userId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
            where.productId = productId;
        }
        if (status) {
            where.status = status;
        }
        if (priority) {
            where.priority = priority;
        }
        return this.prisma.bug.findMany({
            where,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                reporter: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const bug = await this.prisma.bug.findUnique({
            where: { id },
            include: {
                product: true,
                executionCase: {
                    include: {
                        testCase: true,
                    },
                },
                reporter: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!bug) {
            throw new common_1.NotFoundException('Bug not found');
        }
        if (bug.product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return bug;
    }
    async create(dto, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product || product.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const count = await this.prisma.bug.count({
            where: { productId: dto.productId },
        });
        const bugId = `BUG-${String(count + 1).padStart(3, '0')}`;
        return this.prisma.bug.create({
            data: {
                ...dto,
                bugId,
                reportedBy: userId,
            },
        });
    }
    async update(id, dto, userId) {
        await this.findOne(id, userId);
        return this.prisma.bug.update({
            where: { id },
            data: dto,
        });
    }
    async updateStatus(id, status, userId) {
        await this.findOne(id, userId);
        return this.prisma.bug.update({
            where: { id },
            data: { status },
        });
    }
    async addComment(id, dto, userId) {
        await this.findOne(id, userId);
        return this.prisma.comment.create({
            data: {
                bugId: id,
                userId,
                content: dto.content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
};
exports.BugsService = BugsService;
exports.BugsService = BugsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BugsService);
//# sourceMappingURL=bugs.service.js.map