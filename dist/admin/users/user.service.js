"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../sys/prisma/prisma.service");
const token_service_1 = require("../../sys/token/token.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const common_2 = require("@nestjs/common");
let UsersService = UsersService_1 = class UsersService {
    prisma;
    tokenService;
    logger = new common_2.Logger(UsersService_1.name);
    constructor(prisma, tokenService) {
        this.prisma = prisma;
        this.tokenService = tokenService;
    }
    async addAccount(createAdminDto) {
        const { ho_ten, email, so_dt, mat_khau, loai_nguoi_dung = 'ADMIN', } = createAdminDto;
        // Kiểm tra email đã tồn tại
        const existingUser = await this.prisma.nguoiDung.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email đã tồn tại');
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
            this.logger.log(`Tài khoản ${loai_nguoi_dung} mới được tạo: ${newUser.email} (ID: ${newUser.tai_khoan})`);
            // Generate tokens và lưu refresh token
            return await this.generateTokens(newUser);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Đã có lỗi xảy ra khi tạo tài khoản');
        }
    }
    async generateTokens(user) {
        // Tạo token mới
        const { accessToken, refreshToken } = this.tokenService.createTokens(user.tai_khoan);
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
        }
        else {
            // Tạo mới refresh token
            await this.prisma.refreshToken.create({
                data: {
                    userId: user.tai_khoan,
                    hashedToken,
                    expiresAt,
                },
            });
        }
        const userResponse = {
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
    async getUserTypes() {
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
    async getUserListPaginated(page = 1, pageSize = 10) {
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
    async searchUsers(keyword, page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const where = {
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
    async searchUsersNoPag(keyword) {
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
            throw new common_1.BadRequestException('Kết quả quá lớn, vui lòng dùng phân trang');
        }
        return { data: users };
    }
    async adminUpdateUser(tai_khoan, updateAdminUserDto) {
        // Tìm user bằng tai_khoan
        const user = await this.prisma.nguoiDung.findUnique({
            where: { tai_khoan },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Không tìm thấy người dùng với tai_khoan ${tai_khoan}`);
        }
        // Chuẩn bị dữ liệu cập nhật
        const updateData = { ...updateAdminUserDto };
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
                throw new common_1.ConflictException('Email mới đã tồn tại');
            }
        }
        try {
            // Cập nhật user
            const updatedUser = await this.prisma.nguoiDung.update({
                where: { tai_khoan },
                data: updateData,
            });
            // Logging hoạt động cập nhật
            this.logger.log(`Admin đã cập nhật người dùng ID ${tai_khoan}: ${updatedUser.email}`);
            // Trả về response (chỉ các trường an toàn, không trả mật khẩu)
            const responseData = {
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Đã có lỗi xảy ra khi cập nhật thông tin người dùng');
        }
    }
    async adminDeleteUser(tai_khoan) {
        // Tìm user bằng tai_khoan
        const user = await this.prisma.nguoiDung.findUnique({
            where: { tai_khoan },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Không tìm thấy người dùng với tai_khoan ${tai_khoan}`);
        }
        if (user.deletedAt) {
            throw new common_1.BadRequestException(`Người dùng với tai_khoan ${tai_khoan} đã bị xóa trước đó`);
        }
        try {
            // Thực hiện soft delete bằng cách cập nhật deletedAt
            await this.prisma.nguoiDung.update({
                where: { tai_khoan },
                data: { deletedAt: new Date() },
            });
            // Logging hoạt động xóa
            this.logger.log(`Admin đã xóa (soft delete) người dùng ID ${tai_khoan}: ${user.email}`);
            // Xóa refresh tokens liên quan để vô hiệu hóa phiên đăng nhập
            await this.prisma.refreshToken.deleteMany({
                where: { userId: tai_khoan },
            });
            return {
                message: 'Xóa người dùng thành công (soft delete)',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Đã có lỗi xảy ra khi xóa người dùng');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        token_service_1.TokenService])
], UsersService);
//# sourceMappingURL=user.service.js.map