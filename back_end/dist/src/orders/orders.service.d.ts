import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    checkout(userId: number, dto: CheckoutDto): Promise<{
        message: string;
        order: {
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.OrderStatus;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            shippingAddress: string;
            phoneReceiver: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number | null;
        };
    }>;
    findAll(userId: number | null): Promise<({
        user: {
            id: number;
            fullName: string;
            email: string;
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
                productId: number;
                size: string;
                color: string;
                stockQuantity: number;
                sku: string;
            };
        } & {
            id: number;
            productVariantId: number;
            quantity: number;
            orderId: number;
            price: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        shippingAddress: string;
        phoneReceiver: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number | null;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            fullName: string;
            email: string;
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
                productId: number;
                size: string;
                color: string;
                stockQuantity: number;
                sku: string;
            };
        } & {
            id: number;
            productVariantId: number;
            quantity: number;
            orderId: number;
            price: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        shippingAddress: string;
        phoneReceiver: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number | null;
    }>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<{
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        shippingAddress: string;
        phoneReceiver: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number | null;
    }>;
    updatePaymentStatus(id: number, dto: UpdatePaymentStatusDto): Promise<{
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        shippingAddress: string;
        phoneReceiver: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number | null;
    }>;
    confirmBankingPayment(orderId: number, userId: number): Promise<{
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        shippingAddress: string;
        phoneReceiver: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number | null;
    }>;
}
