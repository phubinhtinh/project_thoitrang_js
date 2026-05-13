import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
export class VariantsController {
  constructor(private variantsService: VariantsService) {}

  @Get('products/:productId/variants')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.variantsService.findByProduct(productId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post('products/:productId/variants')
  create(@Param('productId', ParseIntPipe) productId: number, @Body() dto: CreateVariantDto) {
    return this.variantsService.create(productId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put('variants/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVariantDto) {
    return this.variantsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Delete('variants/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.remove(id);
  }
}
