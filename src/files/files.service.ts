import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FilesService {
  getFilePath(filename: string): string {
    return join(__dirname, '../..', 'achievementIcons', filename);
  }
}
