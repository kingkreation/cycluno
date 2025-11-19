export declare class CreateProductDto {
    name: string;
    description?: string;
    industry?: string;
    platform?: string;
}
declare class FeatureDto {
    name: string;
    description?: string;
    priority?: string;
}
export declare class AddManualFeaturesDto {
    features: FeatureDto[];
}
export {};
