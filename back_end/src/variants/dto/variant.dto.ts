import { IsNotEmpty, IsOptional, IsString, IsInt, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ===== Variant (Size) DTOs =====

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsInt()
  @Type(() => Number)
  stockQuantity: number;

  @IsString()
  @IsNotEmpty()
  sku: string;
}

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  stockQuantity?: number;

  @IsString()
  @IsOptional()
  sku?: string;
}

// ===== Color DTOs =====

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Mỗi màu phải có ít nhất 1 size' })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}

export class UpdateColorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  img?: string;
}
