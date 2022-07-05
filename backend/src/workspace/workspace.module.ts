import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  controllers: [WorkspaceController],
  providers: [PrismaService, WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
