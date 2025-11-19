import { PrismaService } from '../common/prisma/prisma.service';
import { QueueService } from '../common/queue/queue.service';
import { CreateProductDto } from './dto';
export declare class ProductsService {
    private prisma;
    private queueService;
    constructor(prisma: PrismaService, queueService: QueueService);
    findAll(userId: string): Promise<{
        featureCount: number;
        testCaseCount: number;
        bugCount: number;
        _count: {
            testCases: number;
            bugs: number;
            features: number;
        };
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        industry: string | null;
        platform: string | null;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        _count: {
            testCases: number;
            bugs: number;
        };
        features: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string | null;
            productId: string;
            status: string;
            source: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        industry: string | null;
        platform: string | null;
    }>;
    create(dto: CreateProductDto, userId: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        industry: string | null;
        platform: string | null;
    }>;
    addManualFeatures(productId: string, features: any[], userId: string): Promise<{
        message: string;
        count: number;
    }>;
    uploadPRD(productId: string, file: Express.Multer.File, userId: string): Promise<{
        message: string;
    }>;
    generateTestCases(productId: string, userId: string): Promise<{
        message: string;
        featureCount: number;
    }>;
}
