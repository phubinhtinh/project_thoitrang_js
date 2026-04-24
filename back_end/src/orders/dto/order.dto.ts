import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  phoneReceiver: string;

  @IsEnum(['cod', 'banking', 'momo', 'vnpay'])
  @IsOptional()
  paymentMethod?: string = 'cod';
}

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status: string;
}

export class UpdatePaymentStatusDto {
  @IsEnum(['unpaid', 'paid'])
  paymentStatus: string;
}
