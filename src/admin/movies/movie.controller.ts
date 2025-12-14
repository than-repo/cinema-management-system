//src\admin\movies\movie.controller.ts

import { Roles } from './../../shared/guards/roles/roles.decorator';
import { RolesGuard } from './../../shared/guards/roles/roles.guard';
import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard';
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { CloudinaryUploadInterceptor } from './../../shared/interceptors/cloudinary-upload.interceptor';
import { MoviesService } from './movie.service';
import { DeleteMovieDto } from './dto/delete-movie.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('QuanLyPhim')
@Controller('QuanLyPhim')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('ThemPhimUploadHinh')
  @UseInterceptors(CloudinaryUploadInterceptor) // Sử dụng CloudinaryUploadInterceptor
  async addMovie(
    @Body('data') data: string, // Key text là 'data' chứa JSON string
    @UploadedFile() hinh_anh?: any,
  ) {
    if (!data) {
      throw new BadRequestException('Data field is required');
    }

    const movie = await this.moviesService.createMovie(data, hinh_anh);
    return {
      message: 'Movie added successfully',
      data: movie,
    };
  }
  @Post('CapNhatPhimUpload')
  @UseInterceptors(CloudinaryUploadInterceptor)
  async updateMovie(
    @Body('data') data: string,
    @UploadedFile() hinh_anh?: any,
  ) {
    if (!data) {
      throw new BadRequestException('Data field is required');
    }

    const movie = await this.moviesService.updateMovie(data, hinh_anh);
    return {
      message: 'Movie updated successfully',
      data: movie,
    };
  }

  @Delete('XoaPhim')
  async deleteMovie(@Body() body: DeleteMovieDto) {
    const movie = await this.moviesService.deleteMovie(body.ma_phim);
    return {
      message: 'Movie deleted successfully (soft delete)',
      data: movie,
    };
  }
}
