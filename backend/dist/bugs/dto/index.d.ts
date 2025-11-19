export declare class CreateBugDto {
    productId: string;
    executionCaseId?: string;
    title: string;
    description: string;
    stepsToReproduce: string[];
    expectedResult: string;
    actualResult: string;
    possibleSolution?: string;
    priority?: string;
    severity?: string;
}
export declare class UpdateBugDto {
    title?: string;
    description?: string;
    stepsToReproduce?: string[];
    priority?: string;
    severity?: string;
    status?: string;
    assignedTo?: string;
}
export declare class AddCommentDto {
    content: string;
}
