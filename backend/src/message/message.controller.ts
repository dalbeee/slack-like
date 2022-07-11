import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';
import { MessageReactionService } from './message-reaction.service';
import { MessageService } from './message.service';

@Controller('/:workspace/:channel')
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

  @Post()
  createMessage(
    @Param('workspace') workspaceId: string,
    @Param('channel') channelId: string,
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

  // deleteMessage() {}

  // findMessageById() {}

  @Get()
  findMessages(
    @Param('workspace') workspaceId: string,
    @Param('channel') channelId: string,
  ) {
    return this.messageService.findMessages({ channelId, workspaceId });
  }
}
