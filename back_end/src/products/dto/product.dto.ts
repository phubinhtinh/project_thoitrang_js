import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsString()
  @IsOptional()
  img?: string;
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

  @IsString()
  @IsOptional()
  img?: string;
}
