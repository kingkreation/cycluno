export declare class CreateExecutionDto {
    productId: string;
    name: string;
    description?: string;
    type?: string;
    url?: string;
    testCaseIds: string[];
}
export declare class UpdateExecutionCaseDto {
    status: string;
    actualResult?: string;
    notes?: string;
}
