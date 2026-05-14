import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByProduct(productId: number): Promise<{
        reviews: ({
            user: {
                fullName: string;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            productId: number;
            userId: number;
            rating: number;
            comment: string | null;
        })[];
        avgRating: number;
        totalReviews: number;
    }>;
    create(userId: number, productId: number, dto: CreateReviewDto): Promise<{
        id: number;
        createdAt: Date;
        productId: number;
        userId: number;
        rating: number;
        comment: string | null;
    }>;
    remove(reviewId: number, userId: number, userRole: string): Promise<{
        message: string;
    }>;
}
