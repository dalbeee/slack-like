import { Injectable } from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { MessageService } from '@src/message/message.service';
import { MessageCreateDto } from './dto/message-create.dto';

@Injectable()
export class SocketIOService {
  constructor(private readonly messageService: MessageService) {}

  saveMessage(user: UserJwtPayload, message: MessageCreateDto) {
    return this.messageService.createMessage(user, {
      channelId: message.socketInfo.channelId,
      workspaceId: message.socketInfo.workspaceId,
      content: message.message,
    });
  }

  deleteMessage(user: UserJwtPayload, messageId: string) {
    return this.messageService.deleteMessage(user, messageId);
  }
}
