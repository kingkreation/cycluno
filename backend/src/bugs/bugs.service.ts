import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBugDto, UpdateBugDto, AddCommentDto } from './dto';

@Injectable()
export class BugsService {
  constructor(private prisma: PrismaService) {}

  async findAll(productId?: string, status?: string, priority?: string, userId?: string) {
    const where: any = {};
    
    if (productId) {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (product && product.userId !== userId) {
        throw new ForbiddenException('Access denied');
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

  async findOne(id: string, userId: string) {
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
      throw new NotFoundException('Bug not found');
    }

    if (bug.product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return bug;
  }

  async create(dto: CreateBugDto, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || product.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Generate bug ID
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

  async update(id: string, dto: UpdateBugDto, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.bug.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, status: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.bug.update({
      where: { id },
      data: { status },
    });
  }

  async addComment(id: string, dto: AddCommentDto, userId: string) {
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
}