import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
export class ColorsController {
  constructor(private colorsService: ColorsService) {}

  @Get('products/:productId/colors')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.colorsService.findByProduct(productId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post('products/:productId/colors')
  create(@Param('productId', ParseIntPipe) productId: number, @Body() dto: CreateColorDto) {
    return this.colorsService.create(productId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put('colors/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColorDto) {
    return this.colorsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Delete('colors/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.remove(id);
  }
}
