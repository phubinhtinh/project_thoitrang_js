import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            color: {
              include: {
                product: {
                  select: { id: true, name: true, basePrice: true, discountPrice: true },
                },
              },
            },
          },
        },
      },
    });

    const cartItems = items.map((item) => {
      const product = item.variant.color.product;
      const price = product.discountPrice || product.basePrice;
      return {
        ...item,
        itemTotal: Number(price) * item.quantity,
      };
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

    return { items: cartItems, totalPrice };
  }

  async addItem(userId: number, dto: AddToCartDto) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.productVariantId },
    });

    if (!variant) throw new NotFoundException('Biến thể sản phẩm không tồn tại');
    if (variant.stockQuantity < (dto.quantity || 1)) {
      throw new BadRequestException('Số lượng tồn kho không đủ');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { userId, productVariantId: dto.productVariantId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + (dto.quantity || 1);
      if (newQuantity > variant.stockQuantity) {
        throw new BadRequestException(
          `Tổng số lượng trong giỏ (${newQuantity}) vượt quá tồn kho (${variant.stockQuantity})`,
        );
      }
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productVariantId: dto.productVariantId,
        quantity: dto.quantity || 1,
      },
    });
  }

  async updateItem(id: number, userId: number, dto: UpdateCartDto) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id, userId },
      include: { variant: true },
    });
    if (!item) throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');

    if (dto.quantity > item.variant.stockQuantity) {
      throw new BadRequestException(
        `Số lượng yêu cầu (${dto.quantity}) vượt quá tồn kho (${item.variant.stockQuantity})`,
      );
    }
    if (dto.quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(id: number, userId: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');

    return this.prisma.cartItem.delete({ where: { id } });
  }
}
