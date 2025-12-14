import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { CreateMovieDto } from './dto/create-movie.dto';
import { PrismaService } from '../../sys/prisma/prisma.service';
import { CloudinaryService } from '../../sys/cloudinary/cloudinary.service';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createMovie(dataString: string, file?: any) {
    let parsedData: CreateMovieDto;
    try {
      parsedData = JSON.parse(dataString);
    } catch (error) {
      throw new BadRequestException('Invalid JSON in data field');
    }

    let hinh_anh: string | undefined;
    if (file) {
      try {
        hinh_anh = await this.cloudinaryService.uploadImage(file.buffer, {
          folder: 'img_movie', // Folder tùy chỉnh cho phim
        });
      } catch (error) {
        throw new BadRequestException('Failed to upload image');
      }
    }

    // Tạo phim trong database
    const movie = await this.prisma.phim.create({
      data: {
        ten_phim: parsedData.ten_phim,
        trailer: parsedData.trailer,
        hinh_anh,
        mo_ta: parsedData.mo_ta,
        ngay_khoi_chieu: new Date(parsedData.ngay_khoi_chieu),
        danh_gia: parsedData.danh_gia,
        hot: parsedData.hot ?? false,
        dang_chieu: parsedData.dang_chieu ?? false,
        sap_chieu: parsedData.sap_chieu ?? false,
      },
    });

    return movie;
  }

  // ... Các import và constructor hiện tại ...

  async updateMovie(dataString: string, file?: any) {
    let parsedData: UpdateMovieDto;
    try {
      parsedData = JSON.parse(dataString);
    } catch (error) {
      throw new BadRequestException('Invalid JSON in data field');
    }

    // Tìm phim hiện tại để lấy ảnh cũ
    const existingMovie = await this.prisma.phim.findUnique({
      where: { ma_phim: parsedData.ma_phim },
    });
    if (!existingMovie) {
      throw new BadRequestException('Movie not found');
    }

    let newHinhAnh: string | undefined = existingMovie.hinh_anh ?? undefined;
    let oldHinhAnh: string | undefined = existingMovie.hinh_anh ?? undefined;

    if (file) {
      try {
        newHinhAnh = await this.cloudinaryService.uploadImage(file.buffer, {
          folder: 'img_movie',
        });
      } catch (error) {
        throw new BadRequestException('Failed to upload new image');
      }
    }

    try {
      // Update phim trong database
      const updatedMovie = await this.prisma.phim.update({
        where: { ma_phim: parsedData.ma_phim },
        data: {
          ten_phim: parsedData.ten_phim ?? existingMovie.ten_phim,
          trailer: parsedData.trailer ?? existingMovie.trailer,
          hinh_anh: newHinhAnh,
          mo_ta: parsedData.mo_ta ?? existingMovie.mo_ta,
          ngay_khoi_chieu: parsedData.ngay_khoi_chieu
            ? new Date(parsedData.ngay_khoi_chieu)
            : existingMovie.ngay_khoi_chieu,
          danh_gia: parsedData.danh_gia ?? existingMovie.danh_gia,
          hot: parsedData.hot ?? existingMovie.hot,
          dang_chieu: parsedData.dang_chieu ?? existingMovie.dang_chieu,
          sap_chieu: parsedData.sap_chieu ?? existingMovie.sap_chieu,
        },
      });

      // Xóa ảnh cũ nếu có ảnh mới và ảnh cũ tồn tại
      if (file && oldHinhAnh) {
        this.cloudinaryService.deleteImageByUrl(oldHinhAnh).catch((err) => {
          // Silent error: Không throw, chỉ log nếu cần
          console.error('Failed to delete old image:', err);
        });
      }

      return updatedMovie;
    } catch (error) {
      // Rollback: Xóa ảnh mới nếu update thất bại và có ảnh mới
      if (file && newHinhAnh) {
        this.cloudinaryService.deleteImageByUrl(newHinhAnh).catch(() => {});
      }
      throw error;
    }
  }

  async deleteMovie(ma_phim: number) {
    // Tìm phim hiện tại
    const existingMovie = await this.prisma.phim.findUnique({
      where: { ma_phim },
    });
    if (!existingMovie) {
      throw new NotFoundException('Movie not found');
    }

    // Xóa ảnh trên Cloudinary nếu tồn tại
    if (existingMovie.hinh_anh) {
      try {
        await this.cloudinaryService.deleteImageByUrl(existingMovie.hinh_anh);
      } catch (error) {
        // Silent error: Không throw, chỉ log để tránh block soft delete
        console.error('Failed to delete image:', error);
      }
    }

    // Soft delete bằng cách update deletedAt
    const deletedMovie = await this.prisma.phim.update({
      where: { ma_phim },
      data: { deletedAt: new Date() },
    });

    return deletedMovie;
  }
}
