import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Bảo mật HTTP Headers (chống XSS, clickjacking, MIME sniffing,...)
  // crossOriginResourcePolicy cần "cross-origin" để frontend (port 5173) load ảnh từ backend (port 3000)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Phục vụ ảnh upload tại /uploads/<filename>
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  // Bật Validation toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Đăng ký Filter Việt hóa lỗi toàn cục
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cho phép FrontEnd gọi API (CORS)
  app.enableCors();

  await app.listen(3000);
  console.log('🚀 Server đang chạy tại http://localhost:3000');
}
bootstrap();
