import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductVariantInlineDto } from '../../products/dto/product.dto';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Mỗi màu phải có ít nhất 1 size' })
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInlineDto)
  variants: ProductVariantInlineDto[];
}

export class UpdateColorDto {
  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  img?: string;
}
