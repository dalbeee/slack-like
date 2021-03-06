import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { PrismaService } from '@src/prisma.service';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';
import { MessageService } from './message.service';

@Injectable()
export class MessageReactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  async createItem(
    user: UserJwtPayload,
    { content, messageId }: MessageReactionCreateDto,
  ) {
    if (content.length !== 2) throw new BadRequestException();

    const message = await this.messageService.findById(messageId);
    if (!message) throw new NotFoundException('not found message');

    const reaction = await this.prisma.messageReaction.findFirst({
      where: { messageId, userId: user.id, content },
      include: { message: true },
    });
    if (reaction) {
      await this.deleteItem(user, reaction.id);
      return {
        action: 'delete',
        reaction,
      };
    }

    const result = await this.prisma.messageReaction.create({
      data: {
        content,
        message: { connect: { id: messageId } },
        userId: user.id,
      },
      include: { message: true },
    });
    return { action: 'create', reaction: result };
  }

  async deleteItem(user: UserJwtPayload, id: string) {
    const reaction = await this.prisma.messageReaction.findFirst({
      where: { id, userId: user.id },
    });
    if (!reaction) throw new BadRequestException();

    return this.prisma.messageReaction.delete({ where: { id } });
  }

  findManyByMessageId(messageId: string) {
    return this.prisma.messageReaction.findMany({
      where: { messageId },
    });
  }
}
