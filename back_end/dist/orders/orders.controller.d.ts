import { OrdersService } from './orders.service';
import { CheckoutDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any, dto: CheckoutDto): Promise<{
        message: string;
        order: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            shippingAddress: string;
            phoneReceiver: string;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            status: import(".prisma/client").$Enums.OrderStatus;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    findAll(req: any): Promise<({
        user: {
            fullName: string;
            email: string;
            id: number;
        } | null;
        items: ({
            variant: {
                color: {
                    product: {
                        id: number;
                        name: string;
                    };
                } & {
                    id: number;
                    name: string;
                    img: string | null;
                    productId: number;
                };
            } & {
                id: number;
                size: string;
                stockQuantity: number;
                sku: string;
                colorId: number;
            };
        } & {
            id: number;
            quantity: number;
            productVariantId: number;
            price: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        shippingAddress: string;
        phoneReceiver: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: number, req: any): Promise<{
        user: {
            fullName: string;
            email: string;
            id: number;
        } | null;
        items: ({
            variant: {
                color: {
                    product: {
                        id: number;
                        name: string;
                    };
                } & {
                    id: number;
                    name: string;
                    img: string | null;
                    productId: number;
                };
            } & {
                id: number;
                size: string;
                stockQuantity: number;
                sku: string;
                colorId: number;
            };
        } & {
            id: number;
            quantity: number;
            productVariantId: number;
            price: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        shippingAddress: string;
        phoneReceiver: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        shippingAddress: string;
        phoneReceiver: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
    } | {
        message: string;
    }>;
    updatePaymentStatus(id: number, dto: UpdatePaymentStatusDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        shippingAddress: string;
        phoneReceiver: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    confirmBanking(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        shippingAddress: string;
        phoneReceiver: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
}
