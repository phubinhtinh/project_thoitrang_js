import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const safeName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .toLowerCase();
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}-${safeName.slice(0, 40)}${extname(file.originalname).toLowerCase() || ''}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(jpe?g|png|webp|gif|avif)$/i.test(file.mimetype)) {
          return cb(new BadRequestException('Chỉ chấp nhận ảnh JPG/PNG/WEBP/GIF/AVIF'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException('Không nhận được file');
    const host = `${req.protocol}://${req.get('host')}`;
    return {
      url: `${host}/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
