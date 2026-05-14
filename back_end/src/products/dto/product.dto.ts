import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// Size/Variant bên trong một Color
export class VariantSizeDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stockQuantity: number;

  @IsString()
  @IsNotEmpty()
  sku: string;
}

// Color chứa nhiều sizes
export class ProductColorInlineDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Tên màu: "Xanh Navy", "Đen"...

  @IsString()
  @IsOptional()
  img?: string; // Ảnh của màu

  @IsArray()
  @ArrayMinSize(1, { message: 'Mỗi màu phải có ít nhất 1 size' })
  @ValidateNested({ each: true })
  @Type(() => VariantSizeDto)
  variants: VariantSizeDto[];
}

export class CreateProductDto {
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  basePrice: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountPrice?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Sản phẩm phải có ít nhất 1 màu' })
  @ValidateNested({ each: true })
  @Type(() => ProductColorInlineDto)
  colors: ProductColorInlineDto[];
}

export class UpdateProductDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountPrice?: number;
}
