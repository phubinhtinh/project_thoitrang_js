import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: number): Promise<{
        items: {
            itemTotal: number;
            variant: {
                product: {
                    id: number;
                    name: string;
                    basePrice: import("@prisma/client/runtime/library").Decimal;
                    discountPrice: import("@prisma/client/runtime/library").Decimal | null;
                    img: string | null;
                };
            } & {
                id: number;
                sku: string;
                productId: number;
                size: string;
                color: string;
                stockQuantity: number;
            };
            id: number;
            createdAt: Date;
            userId: number;
            productVariantId: number;
            quantity: number;
        }[];
        totalPrice: number;
    }>;
    addItem(userId: number, dto: AddToCartDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        productVariantId: number;
        quantity: number;
    }>;
    updateItem(id: number, userId: number, dto: UpdateCartDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        productVariantId: number;
        quantity: number;
    }>;
    removeItem(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        productVariantId: number;
        quantity: number;
    }>;
}
