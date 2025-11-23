import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private genAI;
    private model;
    constructor(configService: ConfigService);
    extractFeaturesFromPRD(prdContent: string): Promise<any[]>;
    generateTestCases(featureName: string, featureDescription: string): Promise<any[]>;
    generateBugReport(testCase: any, actualResult: string): Promise<any>;
    compareResults(expectedResult: string, actualResult: string): Promise<{
        match: boolean;
        confidence: number;
    }>;
}
