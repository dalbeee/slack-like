import { Injectable } from '@nestjs/common';
import { MessageService } from '@src/message/message.service';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class SocketIOService {
  constructor(private readonly messageService: MessageService) {}

  broadcastMessage(message: MessageDto) {
    this.messageService.createMessage({
      channelId: message.socketInfo.channelId,
      workspaceId: message.socketInfo.workspaceId,
      userId: message.socketInfo.userId,
      content: message.message,
    });
    return message;
  }
}
