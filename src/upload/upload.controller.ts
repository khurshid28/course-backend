import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import sharp from 'sharp';
import { unlinkSync } from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `${Date.now()}-${originalName}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/images/${file.filename}`,
      filename: file.filename,
    };
  }

  @Post('image-from-url')
  async uploadImageFromUrl(
    @Body('url') url: string,
    @Body('folder') folder?: string,
  ) {
    if (!url) {
      throw new Error('URL is required');
    }

    const folderPath = folder || 'images';
    const result = await this.uploadService.downloadImageFromUrl(url, folderPath);
    return result;
  }

  @Post('video-from-url')
  async uploadVideoFromUrl(
    @Body('url') url: string,
    @Body('isFree') isFree?: string,
  ) {
    if (!url) {
      throw new Error('URL is required');
    }

    const isFreeBoolean = isFree === 'true' || isFree === '1';
    const result = await this.uploadService.downloadVideoFromUrl(url, isFreeBoolean);
    return result;
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `${Date.now()}-${originalName}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log('File mimetype:', file.mimetype);
        const allowedMimes = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'application/octet-stream'];
        if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          return cb(new Error('Only video files are allowed!'), false);
        }
      },
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File, @Body('isFree') isFree?: string) {
    const isFreeBoolean = isFree === 'true' || isFree === '1';
    const filePath = `./uploads/videos/${file.filename}`;
    
    // Video vaqtini olish
    let duration = 0;
    try {
      duration = await this.uploadService.getVideoDuration(filePath);
    } catch (error) {
      console.error('Error getting video duration:', error);
    }
    
    return {
      url: `/uploads/videos/${file.filename}`,
      filename: file.filename,
      size: file.size, // bytes
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2), // MB formatda
      duration: duration, // seconds
      durationFormatted: this.formatDuration(duration), // HH:MM:SS formatda
      isFree: isFreeBoolean,
    };
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
