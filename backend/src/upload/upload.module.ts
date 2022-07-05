import { Module } from '@nestjs/common';
import { PrismaService } from '@src/prisma.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [PrismaService, UploadService],
})
export class UploadModule {}
