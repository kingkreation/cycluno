export declare class CreateTestCaseDto {
    productId: string;
    featureId?: string;
    scenario: string;
    description?: string;
    steps: string[];
    testData?: string;
    expectedResult: string;
    priority?: string;
}
export declare class UpdateTestCaseDto {
    scenario?: string;
    description?: string;
    steps?: string[];
    testData?: string;
    expectedResult?: string;
    priority?: string;
    status?: string;
}
