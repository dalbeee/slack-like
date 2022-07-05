import { PrismaClient } from '@prisma/client';

interface CreateMessageProps {
  content: string;
  workspaceId: string;
  channelId: string;
  userId: string;
}

const prisma = new PrismaClient();

export const createMessage = (data: CreateMessageProps) => {
  return prisma.message.create({
    data,
  });
};
