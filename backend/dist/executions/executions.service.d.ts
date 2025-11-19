import { PrismaService } from '../common/prisma/prisma.service';
import { QueueService } from '../common/queue/queue.service';
import { CreateExecutionDto, UpdateExecutionCaseDto } from './dto';
export declare class ExecutionsService {
    private prisma;
    private queueService;
    constructor(prisma: PrismaService, queueService: QueueService);
    create(dto: CreateExecutionDto, userId: string): Promise<{
        name: string;
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        status: string;
        url: string | null;
    }>;
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
        cases: ({
            testCase: {
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
            };
            evidences: {
                id: string;
                fileName: string;
                fileUrl: string;
                fileType: string;
                fileSize: number;
                uploadedAt: Date;
                executionCaseId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            testCaseId: string;
            actualResult: string | null;
            notes: string | null;
            executionId: string;
            executedAt: Date | null;
        })[];
    } & {
        name: string;
        type: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        status: string;
        url: string | null;
    }>;
    updateCase(executionId: string, caseId: string, dto: UpdateExecutionCaseDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        testCaseId: string;
        actualResult: string | null;
        notes: string | null;
        executionId: string;
        executedAt: Date | null;
    }>;
    uploadEvidence(executionId: string, executionCaseId: string, file: Express.Multer.File, userId: string): Promise<{
        id: string;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
        uploadedAt: Date;
        executionCaseId: string;
    }>;
}
