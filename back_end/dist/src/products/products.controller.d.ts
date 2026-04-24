import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: {
        search?: string;
        category_id?: string;
        page?: string;
        limit?: string;
    }): Promise<{
        data: ({
            category: {
                id: number;
                name: string;
            };
            variants: {
                id: number;
                sku: string;
                productId: number;
                size: string;
                color: string;
                stockQuantity: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            categoryId: number;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            discountPrice: import("@prisma/client/runtime/library").Decimal | null;
            img: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        avgRating: number;
        reviews: ({
            user: {
                id: number;
                fullName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            productId: number;
            userId: number;
            rating: number;
            comment: string | null;
        })[];
        category: {
            id: number;
            name: string;
        };
        variants: {
            id: number;
            sku: string;
            productId: number;
            size: string;
            color: string;
            stockQuantity: number;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        categoryId: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        categoryId: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        categoryId: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        categoryId: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
    }>;
}
