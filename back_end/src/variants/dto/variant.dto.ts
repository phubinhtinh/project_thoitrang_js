import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
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

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  stockQuantity?: number;

  @IsString()
  @IsOptional()
  sku?: string;
}
