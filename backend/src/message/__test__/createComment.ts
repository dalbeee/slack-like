import { Channel, Message, User, Workspace } from '@prisma/client';

import { PrismaService } from '@src/prisma.service';
import { MessageCreateDto } from '../dto/message-create.dto';
import { MessageService } from '../message.service';

type Props = {
  workspace: Workspace;
  channel: Channel;
  user: User;
  message: Message;
};

const prisma = new PrismaService();
const messageService = new MessageService(prisma);

export const createComment = async (dto: Props) => {
  const commentDto: MessageCreateDto = {
    content: 'comment',
    channelId: dto.channel.id,
    workspaceId: dto.workspace.id,
    ancestorId: dto.message.id,
  };

  const comment = await messageService.createItem(dto.user, commentDto);
  return comment;
};
