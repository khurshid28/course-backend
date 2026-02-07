import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {
    // Set ffmpeg and ffprobe paths if using installers
    try {
      const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
      const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
      ffmpeg.setFfmpegPath(ffmpegInstaller.path);
      ffmpeg.setFfprobePath(ffprobeInstaller.path);
    } catch (e) {
      // If installers not available, use system ffmpeg/ffprobe
      console.log('Using system ffmpeg/ffprobe');
    }
  }

  /**
   * Get video metadata (duration, size) from file or URL
   */
  private async getVideoMetadata(videoPathOrUrl: string): Promise<{ duration?: number; size?: string }> {
    return new Promise((resolve) => {
      const isUrl = videoPathOrUrl.startsWith('http');
      
      // For local files, check if exists and get file size
      let fileSizeInBytes: number | undefined;
      if (!isUrl) {
        if (!fs.existsSync(videoPathOrUrl)) {
          console.log('Video file not found:', videoPathOrUrl);
          resolve({});
          return;
        }
        const stats = fs.statSync(videoPathOrUrl);
        fileSizeInBytes = stats.size;
      }

      // Timeout for HTTP URLs (15 seconds)
      const timeout = isUrl ? setTimeout(() => {
        console.log('Timeout getting video metadata for:', videoPathOrUrl);
        if (fileSizeInBytes) {
          resolve({ size: fileSizeInBytes.toString() });
        } else {
          resolve({});
        }
      }, 15000) : null;

      // Use ffprobe to get duration (works for both local files and URLs)
      ffmpeg.ffprobe(videoPathOrUrl, (err, metadata) => {
        if (timeout) clearTimeout(timeout);
        
        if (err) {
          console.error('Error getting video metadata:', err);
          if (fileSizeInBytes) {
            resolve({ size: fileSizeInBytes.toString() });
          } else {
            resolve({});
          }
          return;
        }

        const duration = metadata.format?.duration;
        const size = fileSizeInBytes || metadata.format?.size;
        
        resolve({
          duration: duration ? Math.round(duration) : undefined,
          size: size ? size.toString() : undefined,
        });
      });
    });
  }

  async findAll() {
    return this.prisma.video.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        section: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' },
      ],
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.video.findMany({
      where: { courseId },
      include: {
        section: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        course: true,
        section: true,
      },
    });

    if (!video) {
      throw new NotFoundException(`Video #${id} not found`);
    }

    return video;
  }

  async create(data: any) {
    // Clean up duration and size
    const cleanData = { ...data };
    
    // Duration: 0 or empty -> null
    if (!cleanData.duration || cleanData.duration === 0) {
      cleanData.duration = null;
    }
    
    // Size: convert string to number, empty/0 -> null
    if (cleanData.size) {
      const sizeNum = typeof cleanData.size === 'string' ? parseInt(cleanData.size, 10) : cleanData.size;
      cleanData.size = sizeNum && sizeNum > 0 ? sizeNum : null;
    } else {
      cleanData.size = null;
    }
    
    // Try to get metadata from video URL (works for both local files and HTTP URLs)
    if (cleanData.url) {
      try {
        let videoPathOrUrl = cleanData.url;
        
        // If it's a local file path (starts with /uploads), convert to full path
        if (!videoPathOrUrl.startsWith('http')) {
          videoPathOrUrl = path.join(process.cwd(), videoPathOrUrl);
        }
        
        const metadata = await this.getVideoMetadata(videoPathOrUrl);
        
        // Only set duration/size if not provided and metadata available
        if (!cleanData.duration && metadata.duration) {
          cleanData.duration = metadata.duration;
        }
        if (!cleanData.size && metadata.size) {
          cleanData.size = parseInt(metadata.size, 10);
        }
      } catch (error) {
        console.error('Error getting video metadata:', error);
        // Continue without metadata - not critical
      }
    }

    return this.prisma.video.create({
      data: cleanData,
      include: {
        course: true,
        section: true,
      },
    });
  }

  async update(id: number, data: any) {
    const existingVideo = await this.findOne(id);
    
    // Clean up duration and size
    const cleanData = { ...data };
    
    // Duration: 0 or empty -> null
    if (cleanData.duration !== undefined) {
      if (!cleanData.duration || cleanData.duration === 0) {
        cleanData.duration = null;
      }
    }
    
    // Size: convert string to number, empty/0 -> null
    if (cleanData.size !== undefined) {
      if (cleanData.size) {
        const sizeNum = typeof cleanData.size === 'string' ? parseInt(cleanData.size, 10) : cleanData.size;
        cleanData.size = sizeNum && sizeNum > 0 ? sizeNum : null;
      } else {
        cleanData.size = null;
      }
    }
    
    // Check if URL changed
    const urlChanged = cleanData.url && cleanData.url !== existingVideo.url;
    
    // Try to get metadata if URL changed
    if (urlChanged) {
      try {
        let videoPathOrUrl = cleanData.url;
        
        // If it's a local file path (starts with /uploads), convert to full path
        if (!videoPathOrUrl.startsWith('http')) {
          videoPathOrUrl = path.join(process.cwd(), videoPathOrUrl);
        }
        
        const metadata = await this.getVideoMetadata(videoPathOrUrl);
        
        // Update duration and size from metadata
        if (metadata.duration) {
          cleanData.duration = metadata.duration;
        }
        if (metadata.size) {
          cleanData.size = parseInt(metadata.size, 10);
        }
      } catch (error) {
        console.error('Error getting video metadata:', error);
        // Continue without metadata - not critical
      }
    }
    
    return this.prisma.video.update({
      where: { id },
      data: cleanData,
      include: {
        course: true,
        section: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.video.delete({ where: { id } });
    return { message: 'Video deleted successfully' };
  }
}
