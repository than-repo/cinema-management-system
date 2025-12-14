import { PrismaModule } from '../../sys/prisma/prisma.module';
import { MoviesController } from './movie.controller';
import { MoviesService } from './movie.service';
import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../../sys/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
