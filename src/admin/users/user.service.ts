import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';
import { TokenService } from '../../sys/token/token.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

import { UpdateAdminUserDto } from './dto/update-user.dto';

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
    private prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async addAccount(createAdminDto: CreateAdminDto): Promise<CreateResponse> {
    const {
      ho_ten,
      email,
      so_dt,
      mat_khau,
      loai_nguoi_dung = 'ADMIN',
    } = createAdminDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    try {
      // Tạo tài khoản mới
      const newUser = await this.prisma.nguoiDung.create({
        data: {
          ho_ten,
          email,
          so_dt,
          mat_khau: hashedPassword,
          loai_nguoi_dung,
        },
      });

      // Note lại (log) tài khoản mới
      this.logger.log(
        `Tài khoản ${loai_nguoi_dung} mới được tạo: ${newUser.email} (ID: ${newUser.tai_khoan})`,
      );

      // Generate tokens và lưu refresh token
      return await this.generateTokens(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra khi tạo tài khoản',
      );
    }
  }

  private async generateTokens(user: any): Promise<CreateResponse> {
    // Tạo token mới
    const { accessToken, refreshToken } = this.tokenService.createTokens(
      user.tai_khoan,
    );

    // Mã hóa refresh token
    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Tính thời gian hết hạn (7 ngày, tương tự mẫu)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Tìm refresh token hiện tại của người dùng (nếu có)
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId: user.tai_khoan },
    });

    if (existingToken) {
      // Cập nhật refresh token hiện có
      await this.prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: {
          hashedToken,
          expiresAt,
          deletedAt: null,
        },
      });
    } else {
      // Tạo mới refresh token
      await this.prisma.refreshToken.create({
        data: {
          userId: user.tai_khoan,
          hashedToken,
          expiresAt,
        },
      });
    }

    const userResponse: UserResponse = {
      tai_khoan: user.tai_khoan,
      ho_ten: user.ho_ten,
      email: user.email,
      so_dt: user.so_dt,
      loai_nguoi_dung: user.loai_nguoi_dung,
    };

    return {
      message: `Tài khoản ${user.loai_nguoi_dung} được tạo thành công`,
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  }

  async getUserTypes(): Promise<any> {
    const result = await this.prisma.nguoiDung.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        loai_nguoi_dung: true,
      },
      distinct: ['loai_nguoi_dung'],
      orderBy: {
        loai_nguoi_dung: 'asc',
      },
    });

    return result.map((item) => item.loai_nguoi_dung);
  }

  async getUserList() {
    return this.prisma.nguoiDung.findMany({
      where: { deletedAt: null },
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        so_dt: true,
        loai_nguoi_dung: true,
      },
    });
  }

  async getUserListPaginated(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedUsersResponse> {
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        where: { deletedAt: null }, // Lọc bỏ bản ghi đã xóa mềm
        select: {
          tai_khoan: true,
          ho_ten: true,
          email: true,
          so_dt: true,
          loai_nguoi_dung: true,
          createdAt: true,
        },
        skip,
        take: pageSize,
        orderBy: { tai_khoan: 'desc' }, // Sắp xếp mặc định theo tai_khoan giảm dần
      }),
      this.prisma.nguoiDung.count({
        where: { deletedAt: null },
      }),
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

  async searchUsers(
    keyword?: string,
    page = 1,
    pageSize = 10,
  ): Promise<PaginatedUsersResponse> {
    const skip = (page - 1) * pageSize;

    const where: any = {
      deletedAt: null,
      ...(keyword && {
        OR: [
          { ho_ten: { contains: keyword } },
          { email: { contains: keyword } },
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
            { ho_ten: { contains: keyword } },
            { email: { contains: keyword } },
            { so_dt: { contains: keyword } },
          ],
        }),
      },
      orderBy: { tai_khoan: 'desc' },
      take: maxLimit + 1,
    });

    if (users.length > maxLimit) {
      throw new BadRequestException(
        'Kết quả quá lớn, vui lòng dùng phân trang',
      );
    }

    return { data: users };
  }

  async adminUpdateUser(
    tai_khoan: number,
    updateAdminUserDto: UpdateAdminUserDto,
  ): Promise<{ message: string; data: UserResponse }> {
    // Tìm user bằng tai_khoan
    const user = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan },
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với tai_khoan ${tai_khoan}`,
      );
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData: any = { ...updateAdminUserDto };

    // Hash mật khẩu nếu được cung cấp
    if (updateAdminUserDto.mat_khau) {
      updateData.mat_khau = await bcrypt.hash(updateAdminUserDto.mat_khau, 10);
    }

    // Kiểm tra email mới nếu có (tránh trùng lặp)
    if (updateAdminUserDto.email && updateAdminUserDto.email !== user.email) {
      const existingEmail = await this.prisma.nguoiDung.findUnique({
        where: { email: updateAdminUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email mới đã tồn tại');
      }
    }

    try {
      // Cập nhật user
      const updatedUser = await this.prisma.nguoiDung.update({
        where: { tai_khoan },
        data: updateData,
      });

      // Logging hoạt động cập nhật
      this.logger.log(
        `Admin đã cập nhật người dùng ID ${tai_khoan}: ${updatedUser.email}`,
      );

      // Trả về response (chỉ các trường an toàn, không trả mật khẩu)
      const responseData: UserResponse = {
        tai_khoan: updatedUser.tai_khoan,
        ho_ten: updatedUser.ho_ten,
        email: updatedUser.email,
        so_dt: updatedUser.so_dt,
        loai_nguoi_dung: updatedUser.loai_nguoi_dung,
      };

      return {
        message: 'Cập nhật thông tin người dùng thành công',
        data: responseData,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra khi cập nhật thông tin người dùng',
      );
    }
  }

  async adminDeleteUser(tai_khoan: number): Promise<{ message: string }> {
    // Tìm user bằng tai_khoan
    const user = await this.prisma.nguoiDung.findUnique({
      where: { tai_khoan },
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với tai_khoan ${tai_khoan}`,
      );
    }

    if (user.deletedAt) {
      throw new BadRequestException(
        `Người dùng với tai_khoan ${tai_khoan} đã bị xóa trước đó`,
      );
    }

    try {
      // Thực hiện soft delete bằng cách cập nhật deletedAt
      await this.prisma.nguoiDung.update({
        where: { tai_khoan },
        data: { deletedAt: new Date() },
      });

      // Logging hoạt động xóa
      this.logger.log(
        `Admin đã xóa (soft delete) người dùng ID ${tai_khoan}: ${user.email}`,
      );

      // Xóa refresh tokens liên quan để vô hiệu hóa phiên đăng nhập
      await this.prisma.refreshToken.deleteMany({
        where: { userId: tai_khoan },
      });

      return {
        message: 'Xóa người dùng thành công (soft delete)',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra khi xóa người dùng',
      );
    }
  }
}
