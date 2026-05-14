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
                size: string;
                color: string;
                stockQuantity: number;
                sku: string;
                img: string | null;
                productId: number;
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
        variants: {
            id: number;
            size: string;
            color: string;
            stockQuantity: number;
            sku: string;
            img: string | null;
            productId: number;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        categoryId: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    create(dto: CreateProductDto): Promise<{
        category: {
            id: number;
            name: string;
        };
        variants: {
            id: number;
            size: string;
            color: string;
            stockQuantity: number;
            sku: string;
            img: string | null;
            productId: number;
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
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        category: {
            id: number;
            name: string;
        };
        variants: {
            id: number;
            size: string;
            color: string;
            stockQuantity: number;
            sku: string;
            img: string | null;
            productId: number;
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
    }>;
}
