import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Response,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response as ExpressResponse } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

import { UploadService } from './upload.service';

const storagePath = '../storage/uploads';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      dest: '../storage/uploads',
      storage: diskStorage({
        filename: (_, __, cb) => {
          cb(null, uuid());
        },
        destination: (_, __, cb) => {
          cb(null, storagePath);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await Promise.allSettled(
      files.map(async (file) => {
        return await this.uploadService.saveFileMetadata(file);
      }),
    );
  }

  @Get(':id')
  async getFile(
    @Param('id') id: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const file = await this.uploadService.getFileMetadata(id);
    const streamFile = createReadStream(`${storagePath}/${file.id}`);

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename=' + file.originalFileName,
    });
    return new StreamableFile(streamFile);
  }
}
