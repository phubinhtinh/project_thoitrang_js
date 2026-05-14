"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrdersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const orders_service_1 = require("./orders.service");
const order_dto_1 = require("./dto/order.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let OrdersController = OrdersController_1 = class OrdersController {
    ordersService;
    logger = new common_1.Logger(OrdersController_1.name);
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async cassoWebhook(body, authHeader) {
        const expectedKey = process.env.CASSO_API_KEY;
        if (expectedKey) {
            const token = (authHeader || '').replace(/^Apikey\s+/i, '').trim();
            if (token !== expectedKey) {
                this.logger.warn('⚠️ Casso webhook: API Key không hợp lệ');
                throw new common_1.UnauthorizedException('API Key không hợp lệ');
            }
        }
        this.logger.log('📥 Casso webhook received: ' + JSON.stringify(body).substring(0, 200));
        return this.ordersService.handleCassoWebhook(body);
    }
    checkout(req, dto) {
        return this.ordersService.checkout(req.user.userId, dto);
    }
    findAll(req) {
        const userId = req.user.role === 'admin' ? null : req.user.userId;
        return this.ordersService.findAll(userId);
    }
    getPaymentStatus(id) {
        return this.ordersService.getPaymentStatus(id);
    }
    findOne(id, req) {
        return this.ordersService.findOne(id, req.user.userId, req.user.role);
    }
    updateStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto);
    }
    updatePaymentStatus(id, dto) {
        return this.ordersService.updatePaymentStatus(id, dto);
    }
    confirmBanking(id) {
        return this.ordersService.confirmBankingPayment(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Post)('webhook/casso'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cassoWebhook", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_dto_1.CheckoutDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "checkout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(':id/payment-status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getPaymentStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, common_1.Put)(':id/payment'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, order_dto_1.UpdatePaymentStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, common_1.Post)(':id/confirm-banking'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "confirmBanking", null);
exports.OrdersController = OrdersController = OrdersController_1 = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map