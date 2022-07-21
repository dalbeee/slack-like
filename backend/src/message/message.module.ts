import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { SocketIoModule } from '@src/socketio/socketio.module';
import { MessageReactionService } from './message-reaction.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [SocketIoModule],
  controllers: [MessageController],
  providers: [PrismaService, MessageService, MessageReactionService],
  exports: [MessageReactionService, MessageService],
})
export class MessageModule {}
