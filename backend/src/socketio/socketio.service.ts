import { Injectable } from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { MessageService } from '@src/message/message.service';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class SocketIOService {
  constructor(private readonly messageService: MessageService) {}

  saveMessage(user: UserJwtPayload, message: MessageDto) {
    return this.messageService.createMessage(user, {
      channelId: message.socketInfo.channelId,
      workspaceId: message.socketInfo.workspaceId,
      content: message.message,
    });
  }
}
