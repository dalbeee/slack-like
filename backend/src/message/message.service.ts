import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { MessageCreateDto } from './dto/message-create.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  createMessage({ content, messageId, userId }: MessageCreateDto) {
    return this.prisma.messageReaction.create({
      data: {
        content,
        message: { connect: { id: messageId } },
        user: { connect: { id: userId } },
      },
    });
  }

  updateMessage() {}

  deleteMessage() {}

  findMessageById() {}
}
