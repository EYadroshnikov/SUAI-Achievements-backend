import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @Roles(UserRole.STUDENT)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PNG image file',
          example: 'image.png',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filename = this.filesService.saveFile(file);
    return { filename };
  }

  @Get(':filename')
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({
    content: { 'image/png': {} },
  })
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = this.filesService.getFile(filename);
    if (file) {
      res.set('Content-Type', 'image/png');
      res.send(file);
    } else {
      res.status(404).send('File not found');
    }
  }
}
