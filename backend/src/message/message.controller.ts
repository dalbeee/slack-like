import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageDeleteDto } from './dto/message-delete.dto';
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

  @Get('/messages')
  findMessages(@Query() dto: MessagesFindDto) {
    return this.messageService.findMany(dto);
  }

  @Get('/messages/:messageId')
  findMessageByMessageId(
    @Param('messageId') messageId: string,
    @Query('role') role: 'message' | 'thread',
  ) {
    return this.messageService.findById(messageId, role);
  }

  @Delete('/messages/:messageId')
  deleteMessage(
    @Body() dto: MessageDeleteDto,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageService.deleteItem(user, dto.messageId);
  }

  // MessageReaction
  @Post('/reactions')
  createMessageReaction(
    @Body() dto: MessageReactionCreateDto,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageReactionService.createItem(user, dto);
  }

  @Delete('/reactions/:reactionId')
  deleteMessageReaction(
    @Param('reactionId') reactionId: string,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.messageReactionService.deleteItem(user, reactionId);
  }
}
