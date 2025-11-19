import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateFeatureDto } from './dto';
export declare class FeaturesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByProduct(productId: string, userId: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string | null;
        productId: string;
        status: string;
        source: string | null;
    }[]>;
    update(id: string, dto: UpdateFeatureDto, userId: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string | null;
        productId: string;
        status: string;
        source: string | null;
    }>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
