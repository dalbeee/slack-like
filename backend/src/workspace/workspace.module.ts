import { forwardRef, Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { UserModule } from '@src/user/user.module';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [WorkspaceController],
  providers: [PrismaService, WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
