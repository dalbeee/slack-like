import { Module } from '@nestjs/common';

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UserModule } from '@src/user/user.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UserModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
