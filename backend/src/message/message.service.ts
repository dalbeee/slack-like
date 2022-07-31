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
    return true;
  }

  async createItem(
    user: UserJwtPayload,
    { content, channelId, workspaceId, ancestorId }: MessageCreateDto,
  ) {
    if (ancestorId) {
      const message = await this.prisma.message.findFirst({
        where: { id: ancestorId },
      });
      if (message.ancestorId)
        throw new BadRequestException('comments cannot be nested');
    }

    try {
      return await this.prisma.message.create({
        data: {
          workspaceId,
          channel: { connect: { id: channelId } },
          userId: user.id,
          content,
          ancestor: ancestorId ? { connect: { id: ancestorId } } : {},
        },
        include: { reactions: true },
      });
    } catch (error) {
      throw new BadRequestException();
    }
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
    await this._validateCorrectUser({ id, userId });
    return await this.prisma.message.delete({ where: { id } });
  }

  findMany(dto: MessagesFindDto) {
    return this.prisma.message.findMany({
      where: { ...dto },
    });
  }

  findById(messageId: string) {
    return this.prisma.message.findUnique({ where: { id: messageId } });
  }

  // thread mode
}
