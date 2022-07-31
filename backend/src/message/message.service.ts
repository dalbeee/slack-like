import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { PrismaService } from '@src/prisma.service';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageUpdateDto } from './dto/message-update.dto';
import { MessagesFindDto } from './dto/messages-find.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async _validateCorrectUser({ id, userId }: { id: string; userId: string }) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });
    if (message.userId !== userId) throw new ForbiddenException();
    return message;
  }

  async createItem(
    user: UserJwtPayload,
    { content, channelId, workspaceId, ancestorId }: MessageCreateDto,
  ) {
    let queryByCommentRole = {};

    if (ancestorId) {
      const ancestorMessage = await this.prisma.message.findFirst({
        where: { id: ancestorId },
      });
      if (!ancestorMessage)
        throw new BadRequestException('Ancestor message not found');
      if (ancestorMessage.ancestorId)
        throw new BadRequestException('comments cannot be nested');

      queryByCommentRole = {
        ancestor: ancestorId ? { connect: { id: ancestorId } } : {},
      };
      await this.prisma.message.update({
        where: { id: ancestorId },
        data: { commentsCount: { increment: 1 } },
      });
    }

    return await this.prisma.message.create({
      data: {
        workspaceId,
        channel: { connect: { id: channelId } },
        userId: user.id,
        content,
        ...queryByCommentRole,
      },
      include: { reactions: true },
    });
  }

  async updateItem(
    { id: userId }: UserJwtPayload,
    { id, ...data }: MessageUpdateDto,
  ) {
    await this._validateCorrectUser({ id, userId });
    return this.prisma.message.update({
      where: { id },
      data,
    });
  }

  async deleteItem({ id: userId }: UserJwtPayload, id: string) {
    const message = await this._validateCorrectUser({ id, userId });
    if (message.ancestorId) {
      await this.prisma.message.update({
        where: { id: message.ancestorId },
        data: {
          commentsCount: { decrement: 1 },
        },
      });
    }

    return await this.prisma.message.delete({ where: { id } });
  }

  findMany(dto: MessagesFindDto) {
    return this.prisma.message.findMany({
      where: { ...dto },
    });
  }

  findById(messageId: string, role: 'message' | 'thread' = 'message') {
    return this.prisma.message.findFirst({
      where: { id: messageId },
      include: { comments: role === 'thread' ? true : false },
    });
  }
}
