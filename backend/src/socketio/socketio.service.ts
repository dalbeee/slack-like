import { BadRequestException, Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';

import { UserJwtPayload } from '@src/auth/types';
import { MessageService } from '@src/message/message.service';
import { SocketReactionTarget, SocketResponse } from '.';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { SocketInfo } from './dto/socket-info.dto';

@Injectable()
export class SocketIOService {
  constructor(private readonly messageService: MessageService) {}

  _createReaction(
    reactionTarget: SocketReactionTarget,
    socketInfo: SocketInfo,
  ) {
    const result: SocketResponse = {
      socketInfo: socketInfo,
      type: 'reaction',
      data: { target: reactionTarget, channelId: socketInfo.channelId },
    };
    return result;
  }

  async saveMessage(user: UserJwtPayload, message: MessageCreateDto) {
    const result = await this.messageService.createMessage(user, {
      channelId: message.socketInfo.channelId,
      workspaceId: message.socketInfo.workspaceId,
      content: message.message,
    });
    const response: SocketResponse = {
      socketInfo: message.socketInfo,
      channelTo: message.socketInfo.channelId,
      type: 'message',
      data: result,
    };
    const reaction = this._createReaction('channel', message.socketInfo);
    return { response, reaction };
  }

  async deleteMessage(user: UserJwtPayload, message: MessageDeleteDto) {
    const result = await this.messageService.deleteMessage(
      user,
      message.messageId,
    );
    if (!result) throw new BadRequestException();
    const response: SocketResponse = {
      socketInfo: message.socketInfo,
      channelTo: message.socketInfo.channelId,
      type: 'message',
      data: {
        id: message.messageId,
      } as Message,
    };
    const reaction = this._createReaction('channel', message.socketInfo);
    return { response, reaction };
  }
}
