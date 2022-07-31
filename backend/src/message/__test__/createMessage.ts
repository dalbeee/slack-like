import { faker } from '@faker-js/faker';
import { Channel, PrismaClient, User, Workspace } from '@prisma/client';
interface CreateMessageProps {
  workspace: Workspace;
  channel: Channel;
  user: User;
  content?: string;
}

const prisma = new PrismaClient();

export const createMessage = async (dto: CreateMessageProps) => {
  const data = {
    workspaceId: dto.workspace.id,
    channelId: dto.channel.id,
    userId: dto.user.id,
  };

  return prisma.message.create({
    data: { ...data, content: dto.content ?? faker.datatype.string(10) },
  });
};
