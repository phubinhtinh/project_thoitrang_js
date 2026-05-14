import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto, UpdateVariantDto, CreateColorDto, UpdateColorDto } from './dto/variant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
export class VariantsController {
  constructor(private variantsService: VariantsService) {}

  // ===== COLOR =====

  @Get('products/:productId/colors')
  findColorsByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.variantsService.findColorsByProduct(productId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post('products/:productId/colors')
  createColor(@Param('productId', ParseIntPipe) productId: number, @Body() dto: CreateColorDto) {
    return this.variantsService.createColor(productId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put('colors/:id')
  updateColor(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColorDto) {
    return this.variantsService.updateColor(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Delete('colors/:id')
  removeColor(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.removeColor(id);
  }

  // ===== VARIANT (SIZE) =====

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post('colors/:colorId/variants')
  createVariant(@Param('colorId', ParseIntPipe) colorId: number, @Body() dto: CreateVariantDto) {
    return this.variantsService.createVariant(colorId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put('variants/:id')
  updateVariant(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVariantDto) {
    return this.variantsService.updateVariant(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Delete('variants/:id')
  removeVariant(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.removeVariant(id);
  }
}
