import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class UploadService {
  private uploadDir = './uploads';

  constructor() {
    // FFmpeg path'ni set qilish (faqat development uchun)
    console.log('=== UploadService Constructor ===');
    
    try {
      // Dynamic require - webpack ignore qiladi
      const ffmpegInstaller = this.requireOptional('@ffmpeg-installer/ffmpeg');
      const ffprobeInstaller = this.requireOptional('@ffprobe-installer/ffprobe');
      
      console.log('ffmpegInstaller:', ffmpegInstaller);
      console.log('ffprobeInstaller:', ffprobeInstaller);
      
      if (ffmpegInstaller) {
        ffmpeg.setFfmpegPath(ffmpegInstaller.path);
        console.log('✅ Using bundled ffmpeg:', ffmpegInstaller.path);
      } else {
        console.log('⚠️ ffmpeg installer not found');
      }
      
      if (ffprobeInstaller) {
        ffmpeg.setFfprobePath(ffprobeInstaller.path);
        console.log('✅ Using bundled ffprobe:', ffprobeInstaller.path);
      } else {
        console.log('⚠️ ffprobe installer not found');
      }
    } catch (e) {
      // Production'da system ffmpeg ishlatiladi
      console.log('❌ Error loading ffmpeg/ffprobe:', e.message);
    }

    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private requireOptional(packageName: string): any {
    try {
      console.log('Trying to require:', packageName);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require(packageName);
      console.log('Successfully loaded:', packageName);
      return module;
    } catch (e) {
      console.log('Failed to load:', packageName, e.message);
      return null;
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general') {
    const folderPath = `${this.uploadDir}/${folder}`;
    
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${extname(file.originalname)}`;
    const filepath = `${folderPath}/${filename}`;

    return {
      filename,
      path: filepath,
      url: `/uploads/${folder}/${filename}`,
    };
  }

  async downloadImageFromUrl(url: string, folder: string = 'images'): Promise<any> {
    try {
      const https = require('https');
      const http = require('http');
      const fs = require('fs');
      const path = require('path');

      // Image faylni saqlash uchun papka
      const uploadDir = `./uploads/${folder}`;
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      // URL'dan original file name olish
      const urlPath = new URL(url).pathname;
      const originalName = path.basename(urlPath).replace(/[^a-zA-Z0-9.-]/g, '_') || 'image.jpg';
      const filename = `${Date.now()}-${originalName}`;
      const filePath = path.join(uploadDir, filename);

      // URL'dan image yuklash
      console.log('Downloading image from URL:', url);
      const client = url.startsWith('https') ? https : http;

      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);

        const request = client.get(url, { timeout: 30000 }, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: ${response.statusCode}`));
            return;
          }

          response.pipe(file);

          file.on('finish', () => {
            file.close();
            console.log('Download completed:', filePath);

            // File size olish
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;

            resolve({
              url: `/uploads/${folder}/${filename}`,
              filename: filename,
              size: fileSize,
              sizeInMB: (fileSize / (1024 * 1024)).toFixed(2),
            });
          });
        }).on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });

        // Request timeout
        request.on('timeout', () => {
          request.destroy();
          fs.unlink(filePath, () => {});
          reject(new Error('Download timeout - server took too long to respond'));
        });
      });
    } catch (error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  async downloadVideoFromUrl(url: string, isFree: boolean = false): Promise<any> {
    try {
      const https = require('https');
      const http = require('http');
      const fs = require('fs');
      const path = require('path');

      // Video faylni saqlash uchun papka
      const uploadDir = './uploads/videos';
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      // URL'dan original file name olish
      const urlPath = new URL(url).pathname;
      const originalName = path.basename(urlPath).replace(/[^a-zA-Z0-9.-]/g, '_') || 'video.mp4';
      const filename = `${Date.now()}-${originalName}`;
      const filePath = path.join(uploadDir, filename);

      // URL'dan video yuklash
      console.log('Downloading video from URL:', url);
      const client = url.startsWith('https') ? https : http;

      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let downloadedSize = 0;

        const request = client.get(url, { timeout: 30000 }, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: ${response.statusCode}`));
            return;
          }

          const totalSize = parseInt(response.headers['content-length'] || '0', 10);

          response.on('data', (chunk) => {
            downloadedSize += chunk.length;
            const progress = totalSize > 0 ? ((downloadedSize / totalSize) * 100).toFixed(2) : '?';
            console.log(`Download progress: ${progress}%`);
          });

          response.pipe(file);

          file.on('finish', async () => {
            file.close();
            console.log('Download completed:', filePath);

            // File size olish
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;

            // Video vaqtini olish
            let duration = 0;
            try {
              duration = await this.getVideoDuration(filePath);
            } catch (error) {
              console.error('Error getting video duration:', error);
            }

            resolve({
              url: `/uploads/videos/${filename}`,
              filename: filename,
              size: fileSize,
              sizeInMB: (fileSize / (1024 * 1024)).toFixed(2),
              duration: duration,
              durationFormatted: this.formatDuration(duration),
              isFree: isFree,
            });
          });
        }).on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });

        // Request timeout
        request.on('timeout', () => {
          request.destroy();
          fs.unlink(filePath, () => {});
          reject(new Error('Download timeout - server took too long to respond'));
        });
      });
    } catch (error) {
      throw new Error(`Failed to download video: ${error.message}`);
    }
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

  async getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      console.log('=== FFmpeg Debug ===');
      console.log('Checking video duration for:', filePath);
      console.log('File exists:', existsSync(filePath));
      
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error('FFprobe error:', err);
          resolve(0); // Error bo'lsa 0 qaytaramiz
        } else {
          console.log('Video format:', metadata?.format);
          const duration = metadata?.format?.duration || 0;
          console.log('Video duration (seconds):', duration);
          resolve(Math.round(duration));
        }
      });
    });
  }
}
