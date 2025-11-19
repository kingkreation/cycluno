import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBugDto, UpdateBugDto, AddCommentDto } from './dto';
export declare class BugsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(productId?: string, status?: string, priority?: string, userId?: string): Promise<({
        product: {
            name: string;
            id: string;
        };
        comments: ({
            user: {
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            bugId: string;
        })[];
        reporter: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        expectedResult: string;
        actualResult: string;
        executionCaseId: string | null;
        stepsToReproduce: string[];
        possibleSolution: string | null;
        severity: string | null;
        assignedTo: string | null;
        bugId: string;
        reportedBy: string;
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
        executionCase: {
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
        };
        comments: ({
            user: {
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            bugId: string;
        })[];
        reporter: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        expectedResult: string;
        actualResult: string;
        executionCaseId: string | null;
        stepsToReproduce: string[];
        possibleSolution: string | null;
        severity: string | null;
        assignedTo: string | null;
        bugId: string;
        reportedBy: string;
    }>;
    create(dto: CreateBugDto, userId: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        expectedResult: string;
        actualResult: string;
        executionCaseId: string | null;
        stepsToReproduce: string[];
        possibleSolution: string | null;
        severity: string | null;
        assignedTo: string | null;
        bugId: string;
        reportedBy: string;
    }>;
    update(id: string, dto: UpdateBugDto, userId: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        expectedResult: string;
        actualResult: string;
        executionCaseId: string | null;
        stepsToReproduce: string[];
        possibleSolution: string | null;
        severity: string | null;
        assignedTo: string | null;
        bugId: string;
        reportedBy: string;
    }>;
    updateStatus(id: string, status: string, userId: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        productId: string;
        status: string;
        expectedResult: string;
        actualResult: string;
        executionCaseId: string | null;
        stepsToReproduce: string[];
        possibleSolution: string | null;
        severity: string | null;
        assignedTo: string | null;
        bugId: string;
        reportedBy: string;
    }>;
    addComment(id: string, dto: AddCommentDto, userId: string): Promise<{
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        bugId: string;
    }>;
}
