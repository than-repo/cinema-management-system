//src\admin\users\user.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  UseInterceptors,
  Query,
  Put,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles/roles.guard';
import { Roles } from '../../shared/guards/roles/roles.decorator';
import { retry } from 'rxjs';
import { TokenCookieInterceptor } from '../../shared/interceptors/token-cookie.interceptor';
import { PaginationDto } from './dto/pagination.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { SearchNoPagDto } from './dto/search-no-pag.dto';
import { UpdateAdminUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('QuanLyNguoiDung')
@Controller('QuanLyNguoiDung')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('ThemNguoiDung')
  @UseInterceptors(TokenCookieInterceptor)
  async addAccount(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.addAccount(createAdminDto);
  }

  @Get('LayDanhSachLoaiNguoiDung')
  async getUserTypes() {
    return this.usersService.getUserTypes();
  }

  @Get('LayDanhSachNguoiDung')
  async getUserList() {
    return this.usersService.getUserList();
  }

  @Get('LayDanhSachNguoiDungPhanTrang')
  async getUserListPaginated(@Query() paginationDto: PaginationDto) {
    return this.usersService.getUserListPaginated(
      paginationDto.page,
      paginationDto.pageSize,
    );
  }

  @Get('TimKiemNguoiDungPhanTrang')
  async searchUsers(@Query() searchUserDto: SearchUserDto) {
    return this.usersService.searchUsers(
      searchUserDto.keyword,
      searchUserDto.page,
      searchUserDto.pageSize,
    );
  }

  @Get('TimKiemNguoiDung')
  async searchUsersNoPag(@Query() searchNoPagDto: SearchNoPagDto) {
    return this.usersService.searchUsersNoPag(searchNoPagDto.keyword);
  }

  @Patch('CapNhatThongTinNguoiDung/:tai_khoan')
  async adminUpdateUser(
    @Param('tai_khoan') tai_khoan: number,
    @Body() updateAdminUserDto: UpdateAdminUserDto,
  ) {
    return this.usersService.adminUpdateUser(tai_khoan, updateAdminUserDto);
  }

  @Delete('XoaNguoiDung/:tai_khoan')
  async adminDeleteUser(@Param('tai_khoan') tai_khoan: number) {
    return this.usersService.adminDeleteUser(tai_khoan);
  }
}
