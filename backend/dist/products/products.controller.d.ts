import { ProductsService } from './products.service';
import { CreateProductDto, AddManualFeaturesDto } from './dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(user: any): Promise<{
        featureCount: number;
        testCaseCount: number;
        bugCount: number;
        _count: {
            testCases: number;
            bugs: number;
            features: number;
        };
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        industry: string | null;
        platform: string | null;
    }[]>;
    findOne(id: string, user: any): Promise<{
        _count: {
            testCases: number;
            bugs: number;
        };
        features: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            priority: string | null;
            productId: string;
            status: string;
            source: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        industry: string | null;
        platform: string | null;
    }>;
    create(dto: CreateProductDto, user: any): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        industry: string | null;
        platform: string | null;
    }>;
    addManualFeatures(id: string, dto: AddManualFeaturesDto, user: any): Promise<{
        message: string;
        count: number;
    }>;
    uploadPRD(id: string, file: Express.Multer.File, user: any): Promise<{
        message: string;
    }>;
    generateTestCases(id: string, user: any): Promise<{
        message: string;
        featureCount: number;
    }>;
}
