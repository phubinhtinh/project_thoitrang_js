export declare class VariantSizeDto {
    size: string;
    stockQuantity: number;
    sku: string;
}
export declare class ProductColorInlineDto {
    name: string;
    img?: string;
    variants: VariantSizeDto[];
}
export declare class CreateProductDto {
    categoryId: number;
    name: string;
    description?: string;
    basePrice: number;
    discountPrice?: number;
    colors: ProductColorInlineDto[];
}
export declare class UpdateProductDto {
    categoryId?: number;
    name?: string;
    description?: string;
    basePrice?: number;
    discountPrice?: number;
}
