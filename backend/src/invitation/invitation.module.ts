import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { UserModule } from '@src/user/user.module';
import { WorkspaceModule } from '@src/workspace/workspace.module';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';

@Module({
  imports: [UserModule, WorkspaceModule],
  controllers: [InvitationController],
  providers: [PrismaService, InvitationService],
})
export class InvitationModule {}
