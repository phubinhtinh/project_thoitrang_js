export declare class CreateVariantDto {
    size: string;
    stockQuantity: number;
    sku: string;
}
export declare class UpdateVariantDto {
    size?: string;
    stockQuantity?: number;
    sku?: string;
}
export declare class CreateColorDto {
    name: string;
    img?: string;
    variants: CreateVariantDto[];
}
export declare class UpdateColorDto {
    name?: string;
    img?: string;
}
