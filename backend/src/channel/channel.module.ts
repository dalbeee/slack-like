import { forwardRef, Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { UserModule } from '@src/user/user.module';
import { WorkspaceModule } from '@src/workspace/workspace.module';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [WorkspaceModule, forwardRef(() => UserModule)],
  controllers: [ChannelController],
  providers: [PrismaService, ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
