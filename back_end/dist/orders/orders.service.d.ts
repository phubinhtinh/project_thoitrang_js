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
            fullName: string;
            email: string;
            id: number;
        } | null;
        items: ({
            variant: {
                product: {
                    id: number;
                    name: string;
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
    findOne(id: number, userId?: number, userRole?: string): Promise<{
        user: {
            fullName: string;
            email: string;
            id: number;
        } | null;
        items: ({
            variant: {
                product: {
                    id: number;
                    name: string;
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
    confirmBankingPayment(orderId: number): Promise<{
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
