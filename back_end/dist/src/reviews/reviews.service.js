"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByProduct(productId) {
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
    async create(userId, productId, dto) {
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
            throw new common_1.BadRequestException('Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công');
        }
        const existingReview = await this.prisma.review.findFirst({
            where: { userId, productId },
        });
        if (existingReview) {
            throw new common_1.ConflictException('Bạn đã đánh giá sản phẩm này rồi');
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
    async remove(reviewId, userId, userRole) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review)
            throw new common_1.NotFoundException('Review không tồn tại');
        if (userRole !== 'admin' && review.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xóa review này');
        }
        await this.prisma.review.delete({ where: { id: reviewId } });
        return { message: 'Xóa đánh giá thành công' };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map