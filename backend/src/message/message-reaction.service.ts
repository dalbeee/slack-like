import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { MessageService } from './message.service';
import { MessageReactionCreateProps } from './types';

@Injectable()
export class MessageReactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  _findByContent({
    messageId,
    userId,
    content,
  }: {
    messageId: string;
    userId: string;
    content: string;
  }) {
    return this.prisma.messageReaction.findFirst({
      where: { messageId, userId, content },
    });
  }

  async create({ content, messageId, userId }: MessageReactionCreateProps) {
    const message = await this.messageService.findById(messageId);
    if (!message) throw new NotFoundException('not found message');

    const existReaction = await this._findByContent({
      content,
      messageId,
      userId,
    });
    if (existReaction) return existReaction;
    try {
      return await this.prisma.messageReaction.create({
        data: {
          content,
          message: { connect: { id: messageId } },
          user: { connect: { id: userId } },
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async delete({ content, messageId, userId }: MessageReactionCreateProps) {
    const { id } = await this._findByContent({ content, messageId, userId });
    if (!id) throw new NotFoundException();
    return this.prisma.messageReaction.delete({ where: { id } });
  }

  findByUserAndMessage({
    messageId,
    userId,
  }: Omit<MessageReactionCreateProps, 'content'>) {
    return this.prisma.messageReaction.findMany({
      where: { messageId, userId },
      select: { content: true },
    });
  }
}
