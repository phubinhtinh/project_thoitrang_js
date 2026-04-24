import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('products/:productId/reviews')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.findByProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('products/:productId/reviews')
  create(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(req.user.userId, productId, dto);
  }

  // User xóa review của mình | Admin xóa bất kỳ review nào
  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id, req.user.userId, req.user.role);
  }
}

