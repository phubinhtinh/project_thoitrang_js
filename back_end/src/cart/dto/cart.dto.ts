import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsInt()
  @Type(() => Number)
  productVariantId: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  quantity?: number = 1;
}

export class UpdateCartDto {
  @IsInt()
  @Type(() => Number)
  quantity: number;
}
