import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryUploadInterceptor } from '../../shared/interceptors/cloudinary-upload.interceptor';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload-test')
  @UseInterceptors(CloudinaryUploadInterceptor)
  async uploadTest(
    @UploadedFile() image: any,
    @Body('description') description?: string,
  ) {
    if (!image) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.cloudinaryService.uploadImage(image.buffer, {
      tags: ['test-upload'],
    });

    return {
      message: 'Tải lên thành công',
      url: imageUrl,
      description: description || 'Không có mô tả được cung cấp',
      originalName: image.originalname,
      size: image.size,
    };
  }

  @Delete('delete-test')
  async deleteTest(@Body('imageUrl') imageUrl: string) {
    if (!imageUrl) {
      throw new BadRequestException('URL hình ảnh là bắt buộc');
    }

    const result = await this.cloudinaryService.deleteImageByUrl(imageUrl);

    return {
      message: 'Đã xóa hình ảnh thành công',
      deleted: result,
    };
  }
}
