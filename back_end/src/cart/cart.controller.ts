import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addItem(@Request() req, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Put(':id')
  updateItem(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCartDto) {
    return this.cartService.updateItem(id, req.user.userId, dto);
  }

  @Delete(':id')
  removeItem(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id, req.user.userId);
  }
}
