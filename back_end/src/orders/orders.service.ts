import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number, dto: CheckoutDto) {
    // Lấy giỏ hàng kèm thông tin variant và product
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: { select: { basePrice: true, discountPrice: true } },
          },
        },
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể đặt hàng');
    }

    // Kiểm tra kho hàng trước
    for (const item of cartItems) {
      if (item.variant.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${item.variant.sku}" (${item.variant.color} - ${item.variant.size}) chỉ còn ${item.variant.stockQuantity} sản phẩm trong kho`,
        );
      }
    }

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = Number(item.variant.product.discountPrice || item.variant.product.basePrice);
      return sum + price * item.quantity;
    }, 0);

    // Transaction: Tạo đơn + Chi tiết + Trừ kho + Xóa giỏ
    const order = await this.prisma.$transaction(async (tx) => {
      // 1. Tạo đơn hàng gốc
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'pending',
          paymentMethod: (dto.paymentMethod as any) || 'cod',
          paymentStatus: 'unpaid',
          shippingAddress: dto.shippingAddress,
          phoneReceiver: dto.phoneReceiver,
        },
      });

      // 2. Chép chi tiết đơn hàng (khóa giá tại thời điểm mua)
      for (const item of cartItems) {
        const price = Number(item.variant.product.discountPrice || item.variant.product.basePrice);
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price,
          },
        });

        // 3. Trừ kho tự động
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // 4. Dọn rác giỏ hàng
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    return {
      message: '🎉 Đặt hàng thành công!',
      order,
    };
  }

  // User: chỉ xem đơn của mình | Admin: truyền null để xem tất cả
  async findAll(userId: number | null) {
    return this.prisma.order.findMany({
      where: userId ? { userId } : {},   // Admin không lọc theo userId
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: {
          include: {
            variant: {
              include: {
                product: { select: { id: true, name: true, img: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: {
          include: {
            variant: {
              include: {
                product: { select: { id: true, name: true, img: true } },
              },
            },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }

  async updatePaymentStatus(id: number, dto: UpdatePaymentStatusDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus: dto.paymentStatus as any },
    });
  }
}
