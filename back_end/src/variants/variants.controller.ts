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

  @Get('colors/:colorId/variants')
  findByColor(@Param('colorId', ParseIntPipe) colorId: number) {
    return this.variantsService.findByColor(colorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post('colors/:colorId/variants')
  create(@Param('colorId', ParseIntPipe) colorId: number, @Body() dto: CreateVariantDto) {
    return this.variantsService.create(colorId, dto);
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
