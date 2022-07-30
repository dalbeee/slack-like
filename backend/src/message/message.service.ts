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
    { id }: UserJwtPayload,
    { content, channelId, workspaceId }: MessageCreateDto,
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
}
