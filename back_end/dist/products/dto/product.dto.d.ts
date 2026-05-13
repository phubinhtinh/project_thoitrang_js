export declare class ProductVariantInlineDto {
    size: string;
    stockQuantity: number;
    sku: string;
}
export declare class ProductColorInlineDto {
    color: string;
    img: string;
    variants: ProductVariantInlineDto[];
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
