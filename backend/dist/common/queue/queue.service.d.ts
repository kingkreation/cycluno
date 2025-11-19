import { ConfigService } from '@nestjs/config';
export declare class QueueService {
    private configService;
    private prdParsingQueue;
    private testCaseGenQueue;
    private bugAiQueue;
    private redisAvailable;
    constructor(configService: ConfigService);
    addPRDParsingJob(data: any): Promise<import("bullmq").Job<any, any, string>>;
    addTestCaseGenerationJob(data: any): Promise<import("bullmq").Job<any, any, string>>;
    addBugAiJob(data: any): Promise<import("bullmq").Job<any, any, string>>;
}
