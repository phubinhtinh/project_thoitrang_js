import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

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

  @IsString()
  @IsOptional()
  color?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  stockQuantity?: number;

  @IsString()
  @IsOptional()
  sku?: string;
}
