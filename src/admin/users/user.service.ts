import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';
import { TokenService } from '../../sys/token/token.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

interface UserResponse {
  tai_khoan: number;
  ho_ten: string;
  email: string;
  so_dt: string | null;
  loai_nguoi_dung: string;
}

interface CreateResponse {
  message: string;
  data: {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  };
}

interface PaginatedUsersResponse {
  data: {
    tai_khoan: number;
    ho_ten: string;
    email: string;
    so_dt: string | null;
    loai_nguoi_dung: string;
    createdAt: Date | null;
  }[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  /* ================= CREATE USER ================= */

  async addAccount(createAdminDto: CreateAdminDto): Promise<CreateResponse> {
    const {
      ho_ten,
      email,
      so_dt,
      mat_khau,
      loai_nguoi_dung = 'ADMIN',
    } = createAdminDto;

    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    try {
      const newUser = await this.prisma.nguoiDung.create({
        data: {
          ho_ten,
          email,
          so_dt,
          mat_khau: hashedPassword,
          loai_nguoi_dung,
        },
      });

      this.logger.log(`Tạo user ${newUser.email} (ID: ${newUser.tai_khoan})`);

      return this.generateTokens(newUser);
    } catch {
      throw new InternalServerErrorException('Lỗi tạo tài khoản');
    }
  }

  private async generateTokens(user: any): Promise<CreateResponse> {
    const { accessToken, refreshToken } = this.tokenService.createTokens(
      user.tai_khoan,
    );

    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.upsert({
      where: { userId: user.tai_khoan },
      update: { hashedToken, expiresAt, deletedAt: null },
      create: { userId: user.tai_khoan, hashedToken, expiresAt },
    });

    return {
      message: 'Tạo tài khoản thành công',
      data: {
        user: {
          tai_khoan: user.tai_khoan,
          ho_ten: user.ho_ten,
          email: user.email,
          so_dt: user.so_dt,
          loai_nguoi_dung: user.loai_nguoi_dung,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  /* ================= SEARCH USERS (SAFE) ================= */

  async searchUsers(
    keyword?: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaginatedUsersResponse> {
    const skip = (page - 1) * pageSize;

    const where = {
      deletedAt: null,
      ...(keyword && {
        OR: [
          { ho_ten: { contains: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
          { so_dt: { contains: keyword } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        where,
        select: {
          tai_khoan: true,
          ho_ten: true,
          email: true,
          so_dt: true,
          loai_nguoi_dung: true,
          createdAt: true,
        },
        orderBy: { tai_khoan: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.nguoiDung.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    };
  }

  async searchUsersNoPag(keyword?: string) {
    const maxLimit = 100;

    const users = await this.prisma.nguoiDung.findMany({
      where: {
        deletedAt: null,
        ...(keyword && {
          OR: [
            { ho_ten: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } },
            { so_dt: { contains: keyword } },
          ],
        }),
      },
      take: maxLimit,
      orderBy: { tai_khoan: 'desc' },
    });

    if (users.length === maxLimit) {
      throw new BadRequestException(
        'Kết quả quá lớn, vui lòng dùng phân trang',
      );
    }

    return { data: users };
  }
}
