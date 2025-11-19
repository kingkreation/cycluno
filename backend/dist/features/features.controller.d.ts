import { FeaturesService } from './features.service';
import { UpdateFeatureDto } from './dto';
export declare class FeaturesController {
    private featuresService;
    constructor(featuresService: FeaturesService);
    findByProduct(productId: string, user: any): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string | null;
        productId: string;
        status: string;
        source: string | null;
    }[]>;
    update(id: string, dto: UpdateFeatureDto, user: any): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string | null;
        productId: string;
        status: string;
        source: string | null;
    }>;
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
}
