"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
//src\admin\users\user.controller.ts
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const jwt_auth_guard_1 = require("../../shared/guards/auth/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles/roles.guard");
const roles_decorator_1 = require("../../shared/guards/roles/roles.decorator");
const token_cookie_interceptor_1 = require("../../shared/interceptors/token-cookie.interceptor");
const pagination_dto_1 = require("./dto/pagination.dto");
const search_user_dto_1 = require("./dto/search-user.dto");
const search_no_pag_dto_1 = require("./dto/search-no-pag.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async addAccount(createAdminDto) {
        return this.usersService.addAccount(createAdminDto);
    }
    async getUserTypes() {
        return this.usersService.getUserTypes();
    }
    async getUserList() {
        return this.usersService.getUserList();
    }
    async getUserListPaginated(paginationDto) {
        return this.usersService.getUserListPaginated(paginationDto.page, paginationDto.pageSize);
    }
    async searchUsers(searchUserDto) {
        return this.usersService.searchUsers(searchUserDto.keyword, searchUserDto.page, searchUserDto.pageSize);
    }
    async searchUsersNoPag(searchNoPagDto) {
        return this.usersService.searchUsersNoPag(searchNoPagDto.keyword);
    }
    async adminUpdateUser(tai_khoan, updateAdminUserDto) {
        return this.usersService.adminUpdateUser(tai_khoan, updateAdminUserDto);
    }
    async adminDeleteUser(tai_khoan) {
        return this.usersService.adminDeleteUser(tai_khoan);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('ThemNguoiDung'),
    (0, common_1.UseInterceptors)(token_cookie_interceptor_1.TokenCookieInterceptor),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addAccount", null);
__decorate([
    (0, common_1.Get)('LayDanhSachLoaiNguoiDung'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserTypes", null);
__decorate([
    (0, common_1.Get)('LayDanhSachNguoiDung'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserList", null);
__decorate([
    (0, common_1.Get)('LayDanhSachNguoiDungPhanTrang'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserListPaginated", null);
__decorate([
    (0, common_1.Get)('TimKiemNguoiDungPhanTrang'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_user_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)('TimKiemNguoiDung'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_no_pag_dto_1.SearchNoPagDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsersNoPag", null);
__decorate([
    (0, common_1.Patch)('CapNhatThongTinNguoiDung/:tai_khoan'),
    __param(0, (0, common_1.Param)('tai_khoan')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateAdminUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "adminUpdateUser", null);
__decorate([
    (0, common_1.Delete)('XoaNguoiDung/:tai_khoan'),
    __param(0, (0, common_1.Param)('tai_khoan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "adminDeleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('QuanLyNguoiDung'),
    (0, common_1.Controller)('QuanLyNguoiDung'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [user_service_1.UsersService])
], UsersController);
//# sourceMappingURL=user.controller.js.map