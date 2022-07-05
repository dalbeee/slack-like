import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [PrismaService, ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
