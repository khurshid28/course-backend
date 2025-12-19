import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class UploadService {
  private uploadDir = './uploads';

  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
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
}
