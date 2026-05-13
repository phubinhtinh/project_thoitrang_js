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
                img: string | null;
                sku: string;
                productId: number;
                size: string;
                color: string;
                stockQuantity: number;
            }[];
        } & {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            discountPrice: import("@prisma/client/runtime/library").Decimal | null;
            img: string | null;
            categoryId: number;
            updatedAt: Date;
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
        category: {
            id: number;
            name: string;
        };
        variants: {
            id: number;
            img: string | null;
            sku: string;
            productId: number;
            size: string;
            color: string;
            stockQuantity: number;
        }[];
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
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
        categoryId: number;
        updatedAt: Date;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
        categoryId: number;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
        categoryId: number;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
        img: string | null;
        categoryId: number;
        updatedAt: Date;
    }>;
}
