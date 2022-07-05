import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { WorkspaceModule } from '@src/workspace/workspace.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [WorkspaceModule],
  controllers: [ChannelController],
  providers: [PrismaService, ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
