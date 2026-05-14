export declare class ProductVariantInlineDto {
    size: string;
    color: string;
    stockQuantity: number;
    sku: string;
    img?: string;
}
export declare class CreateProductDto {
    categoryId: number;
    name: string;
    description?: string;
    basePrice: number;
    discountPrice?: number;
    variants: ProductVariantInlineDto[];
}
export declare class UpdateProductDto {
    categoryId?: number;
    name?: string;
    description?: string;
    basePrice?: number;
    discountPrice?: number;
}
