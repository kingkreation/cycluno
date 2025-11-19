import { TestCasesService } from './testcases.service';
import { CreateTestCaseDto, UpdateTestCaseDto } from './dto';
export declare class TestCasesController {
    private testCasesService;
    constructor(testCasesService: TestCasesService);
    findAll(productId: string, featureId: string, user: any): Promise<({
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
    findOne(id: string, user: any): Promise<{
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
    create(dto: CreateTestCaseDto, user: any): Promise<{
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
    update(id: string, dto: UpdateTestCaseDto, user: any): Promise<{
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
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
}
