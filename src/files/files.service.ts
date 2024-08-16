import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadPath = './uploads/';
  private readonly logger: Logger = new Logger(FilesService.name);

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath);
    }
  }

  saveFile(file: Express.Multer.File): string {
    const extension = path.extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${extension}`;

    const filePath = path.join(this.uploadPath, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    // Запускаем таймер на удаление через 5 минут
    setTimeout(
      () => {
        this.deleteFile(uniqueFilename);
      },
      5 * 60 * 1000,
    ); // 5 минут в миллисекундах

    return uniqueFilename;
  }

  getFile(filename: string): Buffer | null {
    const filePath = path.join(this.uploadPath, filename);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    return null;
  }

  deleteFile(filename: string): void {
    const filePath = path.join(this.uploadPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.log(`File ${filename} deleted.`);
    }
  }
}
