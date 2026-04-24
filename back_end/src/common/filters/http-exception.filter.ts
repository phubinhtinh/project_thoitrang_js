import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Lỗi hệ thống, vui lòng thử lại sau';
    let error = 'Internal Server Error';

    // Dịch các lỗi Common
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      error = res.error || 'Error';
      const defaultMessage = res.message;

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          message = 'Dữ liệu không hợp lệ hoặc thiếu thông tin';
          // Nếu có lỗi validation chi tiết thì lấy lỗi đó
          if (Array.isArray(defaultMessage)) {
             message = defaultMessage.join(', ');
          }
          break;
        case HttpStatus.UNAUTHORIZED:
          message = 'Vui lòng đăng nhập để thực hiện thao tác này';
          break;
        case HttpStatus.FORBIDDEN:
          message = 'Bạn không có quyền truy cập tính năng này';
          break;
        case HttpStatus.NOT_FOUND:
          message = 'Không tìm thấy tài nguyên yêu cầu (404)';
          break;
        case HttpStatus.CONFLICT:
          message = defaultMessage || 'Dữ liệu đã tồn tại trong hệ thống';
          break;
        default:
          message = typeof defaultMessage === 'string' ? defaultMessage : 'Đã có lỗi xảy ra';
      }
    } else {
      // Xử lý lỗi Prisma hoặc lỗi code không thuộc HttpException
      const exceptionString = exception?.toString() || '';
      
      if (exceptionString.includes('PrismaClientInitializationError') || exceptionString.includes('Can\'t reach database server')) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Lỗi kết nối Cơ sở dữ liệu, vui lòng kiểm tra lại server DB';
        error = 'Database Connection Error';
      } else if (exceptionString.includes('PrismaClientKnownRequestError')) {
          message = 'Lỗi truy vấn dữ liệu (Prisma Error)';
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      error: error,
    });
  }
}
