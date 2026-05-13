import { Injectable, BadRequestException, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    };
  }

  async create(userId: number, productId: number, dto: CreateReviewDto) {
    // Kiểm tra đã mua và đã giao thành công chưa
    const deliveredOrder = await this.prisma.order.findFirst({
      where: {
        userId,
        status: 'delivered',
        items: {
          some: {
            variant: {
              productId,
            },
          },
        },
      },
    });

    if (!deliveredOrder) {
      throw new BadRequestException(
        'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công',
      );
    }

    // Kiểm tra đã đánh giá chưa
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, productId },
    });

    if (existingReview) {
      throw new ConflictException('Bạn đã đánh giá sản phẩm này rồi');
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }
  async remove(reviewId: number, userId: number, userRole: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Review không tồn tại');

    // User chỉ được xóa review của chính mình, admin xóa được tất cả
    if (userRole !== 'admin' && review.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa review này');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Xóa đánh giá thành công' };
  }
}
