import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async getFileMetadata(id: string) {
    const file = await this.prisma.file.findFirst({
      where: { id },
    });
    if (!file) throw new NotFoundException();
    return file;
  }

  async saveFileMetadata(file: Express.Multer.File) {
    const originalFileName = file.originalname;
    const existFile = await this.prisma.file.findFirst({
      where: { originalFileName },
    });
    if (existFile) throw new ConflictException('already exist filename');

    return await this.prisma.file.create({
      data: { id: file.filename, originalFileName },
    });
  }
}
