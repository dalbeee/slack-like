import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';
import { MessagesFindDto } from './dto/messages-find.dto';
import { MessageReactionService } from './message-reaction.service';
import { MessageService } from './message.service';

@Controller('/messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageReactionService: MessageReactionService,
  ) {}

  @Post('/messages')
  createMessage(
    @Body() dto: MessageCreateDto,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageService.createItem(user, dto);
  }

  @Delete('/messages/:messageId')
  deleteMessage(
    @Param('messageId') id: string,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageService.deleteItem(user, id);
  }

  @Get('/messages')
  findMessages(@Param() dto: MessagesFindDto) {
    return this.messageService.findMany(dto);
  }

  // MessageReaction
  @Post('/reactions')
  createMessageReaction(@Body() dto: MessageReactionCreateDto) {
    return this.messageReactionService.createItem(dto);
  }

  @Delete('/reactions/:reactionId')
  deleteMessageReaction(
    @Param('reactionId') reactionId: string,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageReactionService.deleteItem(user, reactionId);
  }
}
