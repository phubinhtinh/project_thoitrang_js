import { Injectable, ConflictException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        role: 'customer',  // Luôn là customer — Admin chỉ được tạo qua seed
      },
    });

    return {
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập thành công',
      accessToken: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  // ===== QUẢN LÝ USER (Chỉ ADMIN) =====

  // Xem danh sách tất cả user
  // async findAllUsers() {
  //   return this.prisma.user.findMany({
  //     select: {
  //       id: true,
  //       fullName: true,
  //       email: true,
  //       phone: true,
  //       role: true,
  //       createdAt: true,
  //     },
  //     orderBy: { createdAt: 'desc' },
  //   });
  // }

  // Nâng/Hạ quyền user
  // async updateUserRole(userId: number, role: string) {
  //   const user = await this.prisma.user.findUnique({ where: { id: userId } });

  //   if (!user) throw new NotFoundException('Người dùng không tồn tại');

  //   // Không cho phép thay đổi role của admin gốc (seed)
  //   if (user.email === (process.env.ADMIN_EMAIL || 'admin@shopthoitrang.com')) {
  //     throw new ForbiddenException('Không thể thay đổi quyền của Admin gốc');
  //   }

  //   return this.prisma.user.update({
  //     where: { id: userId },
  //     data: { role: role as any },
  //     select: {
  //       id: true,
  //       fullName: true,
  //       email: true,
  //       role: true,
  //     },
  //   });
  // }

  // // Xóa user
  // async removeUser(userId: number) {
  //   const user = await this.prisma.user.findUnique({ where: { id: userId } });

  //   if (!user) throw new NotFoundException('Người dùng không tồn tại');

  //   if (user.email === (process.env.ADMIN_EMAIL || 'admin@shopthoitrang.com')) {
  //     throw new ForbiddenException('Không thể xóa Admin gốc');
  //   }

  //   await this.prisma.user.delete({ where: { id: userId } });
  //   return { message: `Đã xóa người dùng ${user.email}` };
  // }
}
