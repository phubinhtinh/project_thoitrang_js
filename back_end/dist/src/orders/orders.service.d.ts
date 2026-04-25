import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    checkout(userId: number, dto: CheckoutDto): Promise<{
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
    findAll(userId: number | null): Promise<({
        user: {
            id: number;
            email: string;
            fullName: string;
        } | null;
        items: ({
            variant: {
                product: {
                    id: number;
                    name: string;
                    img: string | null;
                };
            } & {
                id: number;
                img: string | null;
                sku: string;
                productId: number;
                size: string;
                color: string;
                stockQuantity: number;
            };
        } & {
            id: number;
            productVariantId: number;
            quantity: number;
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
    findOne(id: number): Promise<{
        user: {
            id: number;
            email: string;
            fullName: string;
        } | null;
        items: ({
            variant: {
                product: {
                    id: number;
                    name: string;
                    img: string | null;
                };
            } & {
                id: number;
                img: string | null;
                sku: string;
                productId: number;
                size: string;
                color: string;
                stockQuantity: number;
            };
        } & {
            id: number;
            productVariantId: number;
            quantity: number;
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
}
