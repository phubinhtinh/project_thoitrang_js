import { ProductVariantInlineDto } from '../../products/dto/product.dto';
export declare class CreateColorDto {
    color: string;
    img: string;
    variants: ProductVariantInlineDto[];
}
export declare class UpdateColorDto {
    color?: string;
    img?: string;
}
