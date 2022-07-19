import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';
import { MessageReactionService } from './message-reaction.service';
import { MessageService } from './message.service';

@Controller('/messages/:workspaceId/:channelId')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageReactionService: MessageReactionService,
  ) {}

  @Post('/:messageId/reactions')
  createMessageReaction(
    @Param('messageId') messageId: string,
    @Body() data: MessageReactionCreateDto,
  ) {
    return this.messageReactionService.create({ ...data, messageId });
  }

  @Post('/')
  createMessage(
    @Param('workspaceId') workspaceId: string,
    @Param('channelId') channelId: string,
    @Body() data: MessageCreateDto,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageService.createMessage(user, {
      ...data,
      workspaceId,
      channelId,
    });
  }

  // updateMessage() {}

  @Delete('/:messageId')
  deleteMessage(
    @Param('messageId') id: string,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageService.deleteMessage(user, id);
  }

  // findMessageById() {}

  @Get()
  findMessages(
    @Param('workspaceId') workspaceId: string,
    @Param('channelId') channelId: string,
  ) {
    console.log('first');
    return this.messageService.findMessages({ channelId, workspaceId });
  }
}
