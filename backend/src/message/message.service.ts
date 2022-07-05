import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { MessageUpdateDto } from './dto/message-update.dto';
import { MessagesFindDto } from './dto/messages-find.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async _validateCollectUser({ id, userId }: { id: string; userId: string }) {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });
    if (message.userId !== userId) throw new ForbiddenException();
    return true;
  }

  async createMessage({
    content,
    userId,
    channelId,
    workspaceId,
  }: MessageCreateDto) {
    try {
      return await this.prisma.message.create({
        data: {
          content,
          user: { connect: { id: userId } },
          workspace: { connect: { id: workspaceId } },
          channel: { connect: { id: channelId } },
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async updateMessage({ id, userId, ...data }: MessageUpdateDto) {
    await this._validateCollectUser({ id, userId });
    return this.prisma.message.update({
      where: { id },
      data,
    });
  }

  async deleteMessage({ id, userId }: MessageDeleteDto) {
    await this._validateCollectUser({ id, userId });
    await this.prisma.message.delete({ where: { id } });
    return true;
  }

  findMessages({ channelId, workspaceId }: MessagesFindDto) {
    return this.prisma.message.findMany({
      where: { channelId, workspaceId },
    });
  }
}
