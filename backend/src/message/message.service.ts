import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { PrismaService } from '@src/prisma.service';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { MessageUpdateDto } from './dto/message-update.dto';
import { MessagesFindDto } from './dto/messages-find.dto';
import { MessageCreateProps } from './types';

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

  async createMessage(
    { id }: UserJwtPayload,
    { content, channelId, workspaceId }: MessageCreateProps,
  ) {
    try {
      return await this.prisma.message.create({
        data: {
          content,
          user: { connect: { id } },
          workspace: { connect: { id: workspaceId } },
          channel: { connect: { id: channelId } },
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async updateMessage(
    { id: userId }: UserJwtPayload,
    { id, ...data }: MessageUpdateDto,
  ) {
    await this._validateCollectUser({ id, userId });
    return this.prisma.message.update({
      where: { id },
      data,
    });
  }

  async deleteMessage({ id: userId }: UserJwtPayload, id: string) {
    await this._validateCollectUser({ id, userId });
    await this.prisma.message.delete({ where: { id } });
    return true;
  }

  findMessages({ channelId, workspaceId }: MessagesFindDto) {
    return this.prisma.message.findMany({
      where: { channelId, workspaceId },
    });
  }

  findById(messageId: string) {
    return this.prisma.message.findUnique({ where: { id: messageId } });
  }
}
