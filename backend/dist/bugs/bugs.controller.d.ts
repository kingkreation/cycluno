import { BugsService } from './bugs.service';
import { CreateBugDto, UpdateBugDto, AddCommentDto } from './dto';
export declare class BugsController {
    private bugsService;
    constructor(bugsService: BugsService);
    findAll(productId: string, status: string, priority: string, user: any): Promise<({
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
    create(dto: CreateBugDto, user: any): Promise<{
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
    update(id: string, dto: UpdateBugDto, user: any): Promise<{
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
    updateStatus(id: string, status: string, user: any): Promise<{
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
    addComment(id: string, dto: AddCommentDto, user: any): Promise<{
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
