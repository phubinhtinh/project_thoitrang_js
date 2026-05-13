export declare class CreateProductDto {
    categoryId: number;
    name: string;
    description?: string;
    basePrice: number;
    discountPrice?: number;
    img?: string;
}
export declare class UpdateProductDto {
    categoryId?: number;
    name?: string;
    description?: string;
    basePrice?: number;
    discountPrice?: number;
    img?: string;
}
