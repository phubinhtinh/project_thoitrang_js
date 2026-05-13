import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
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
    create(req: any, productId: number, dto: CreateReviewDto): Promise<{
        id: number;
        createdAt: Date;
        productId: number;
        userId: number;
        rating: number;
        comment: string | null;
    }>;
    remove(req: any, id: number): Promise<{
        message: string;
    }>;
}
