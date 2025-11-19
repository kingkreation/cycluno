import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getProductReport(productId: string, featureId: string, priority: string, user: any): Promise<{
        summary: {
            totalTestCases: number;
            executed: number;
            passed: number;
            failed: number;
            pending: number;
            successRate: number;
            totalBugs: number;
            openBugs: number;
            fixedBugs: number;
        };
        priorityBreakdown: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.TestCaseGroupByOutputType, "priority"[]> & {
            _count: number;
        })[];
        featureBreakdown: {
            featureName: string;
            count: number;
        }[];
        executionTrend: {
            date: string;
            passed: number;
            failed: number;
            pending: number;
        }[];
    }>;
}
