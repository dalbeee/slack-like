import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';

@Injectable()
export class MessageReactionService {
  constructor(private readonly prisma: PrismaService) {}

  _findByContent({
    messageId,
    userId,
    content,
  }: {
    messageId: string;
    userId: string;
    content: string;
  }) {
    const row = this.prisma.messageReaction.findFirst({
      where: { messageId, userId, content },
    });
    if (!row) throw new NotFoundException();
    return row;
  }

  async create({ content, messageId, userId }: MessageReactionCreateDto) {
    const existRow = await this._findByContent({ content, messageId, userId });
    if (existRow) return existRow;
    try {
      return await this.prisma.messageReaction.create({
        data: {
          content,
          message: { connect: { id: messageId } },
          user: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async delete({ content, messageId, userId }: MessageReactionCreateDto) {
    const { id } = await this._findByContent({ content, messageId, userId });
    if (!id) throw new NotFoundException();
    return this.prisma.messageReaction.delete({ where: { id } });
  }

  findByUserAndMessage({
    messageId,
    userId,
  }: Omit<MessageReactionCreateDto, 'content'>) {
    return this.prisma.messageReaction.findMany({
      where: { messageId, userId },
      select: { content: true },
    });
  }
}
