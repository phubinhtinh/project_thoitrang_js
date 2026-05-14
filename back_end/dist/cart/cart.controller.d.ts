import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
        items: {
            itemTotal: number;
            variant: {
                product: {
                    id: number;
                    name: string;
                    basePrice: import("@prisma/client/runtime/library").Decimal;
                    discountPrice: import("@prisma/client/runtime/library").Decimal | null;
                };
            } & {
                id: number;
                size: string;
                color: string;
                stockQuantity: number;
                sku: string;
                img: string | null;
                productId: number;
            };
            id: number;
            createdAt: Date;
            userId: number;
            quantity: number;
            productVariantId: number;
        }[];
        totalPrice: number;
    }>;
    addItem(req: any, dto: AddToCartDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        quantity: number;
        productVariantId: number;
    }>;
    updateItem(req: any, id: number, dto: UpdateCartDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        quantity: number;
        productVariantId: number;
    }>;
    removeItem(req: any, id: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        quantity: number;
        productVariantId: number;
    }>;
}
