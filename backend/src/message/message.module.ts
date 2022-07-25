import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { MessageReactionService } from './message-reaction.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [PrismaService, MessageService, MessageReactionService],
  exports: [MessageReactionService, MessageService],
})
export class MessageModule {}
