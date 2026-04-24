import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bảo mật HTTP Headers (chống XSS, clickjacking, MIME sniffing,...)
  app.use(helmet());

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
