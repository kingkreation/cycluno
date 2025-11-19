import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTestCaseDto, UpdateTestCaseDto } from './dto';
export declare class TestCasesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(productId?: string, featureId?: string, userId?: string): Promise<({
        product: {
            name: string;
            id: string;
        };
        feature: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string | null;
            productId: string;
            status: string;
            source: string | null;
        };
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        featureId: string | null;
        scenario: string;
        steps: string[];
        testData: string | null;
        expectedResult: string;
        testCaseId: string;
        loggedBy: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        product: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            industry: string | null;
            platform: string | null;
        };
        feature: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string | null;
            productId: string;
            status: string;
            source: string | null;
        };
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        featureId: string | null;
        scenario: string;
        steps: string[];
        testData: string | null;
        expectedResult: string;
        testCaseId: string;
        loggedBy: string;
    }>;
    create(dto: CreateTestCaseDto, userId: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        featureId: string | null;
        scenario: string;
        steps: string[];
        testData: string | null;
        expectedResult: string;
        testCaseId: string;
        loggedBy: string;
    }>;
    update(id: string, dto: UpdateTestCaseDto, userId: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        featureId: string | null;
        scenario: string;
        steps: string[];
        testData: string | null;
        expectedResult: string;
        testCaseId: string;
        loggedBy: string;
    }>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
