import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: number): Promise<{
        items: {
            itemTotal: number;
            variant: {
                productColor: {
                    product: {
                        id: number;
                        name: string;
                        basePrice: import("@prisma/client/runtime/library").Decimal;
                        discountPrice: import("@prisma/client/runtime/library").Decimal | null;
                    };
                } & {
                    id: number;
                    color: string;
                    img: string;
                    productId: number;
                };
            } & {
                id: number;
                size: string;
                stockQuantity: number;
                sku: string;
                colorId: number;
            };
            id: number;
            createdAt: Date;
            userId: number;
            quantity: number;
            productVariantId: number;
        }[];
        totalPrice: number;
    }>;
    addItem(userId: number, dto: AddToCartDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        quantity: number;
        productVariantId: number;
    }>;
    updateItem(id: number, userId: number, dto: UpdateCartDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        quantity: number;
        productVariantId: number;
    }>;
    removeItem(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        quantity: number;
        productVariantId: number;
    }>;
}
