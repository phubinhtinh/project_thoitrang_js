import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards, Request, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { OrdersService } from './orders.service';
import { CheckoutDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private ordersService: OrdersService) {}

  /**
   * Webhook Casso — PUBLIC (không cần JWT).
   * Casso gửi POST khi có giao dịch mới vào tài khoản ngân hàng.
   */
  @SkipThrottle()
  @Post('webhook/casso')
  async cassoWebhook(
    @Body() body: any, 
    @Headers('authorization') authHeader: string,
    @Headers('secure-token') secureTokenHeader: string,
  ) {
    this.logger.log(`📥 Casso webhook headers - auth: ${authHeader}, secure-token: ${secureTokenHeader}`);
    
    // Xác thực: Casso gửi header "Authorization: Apikey <key>" HOẶC "secure-token: <key>"
    const expectedKey = process.env.CASSO_WEBHOOK_KEY;
    if (expectedKey) {
      let token = (authHeader || '').replace(/^Apikey\s+/i, '').trim();
      if (!token) {
        token = (secureTokenHeader || '').trim();
      }
      
      if (token !== expectedKey) {
        this.logger.warn(`⚠️ Casso webhook: API Key không hợp lệ. Token nhận: '${token}'`);
        
        // --- WORKAROUND CHO NÚT "GỌI THỬ" CỦA CASSO ---
        // Nếu Casso không gửi token (token rỗng), ta tạm thời cho qua 
        // để Casso nhận được status 200/201 và hiện nút Lưu/Tiếp tục.
        if (token === '') {
          this.logger.log('🔓 Đã cho phép Request đi qua (vì Token rỗng - Test mode của Casso)');
          return { message: 'Test call passed' };
        }

        throw new UnauthorizedException(`API Key không hợp lệ (Casso Token mismatch). Token nhận từ Casso: '${token}', Token mong đợi: '${expectedKey}'`);
      }
    }

    this.logger.log('📥 Casso webhook received: ' + JSON.stringify(body).substring(0, 200));
    return this.ordersService.handleCassoWebhook(body);
  }

  // === Các endpoint cần đăng nhập ===

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('checkout')
  checkout(@Request() req, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Request() req) {
    const userId = req.user.role === 'admin' ? null : req.user.userId;
    return this.ordersService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/payment-status')
  getPaymentStatus(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getPaymentStatus(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.findOne(id, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put(':id/payment')
  updatePaymentStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentStatusDto) {
    return this.ordersService.updatePaymentStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post(':id/confirm-banking')
  confirmBanking(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.confirmBankingPayment(id);
  }
}
