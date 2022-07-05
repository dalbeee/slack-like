import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateChannelProps {
  name?: string;
  workspaceId: string;
}

export const createChannel = (data: CreateChannelProps) => {
  return prisma.channel.create({
    data: { name: faker.datatype.string(), ...data },
  });
};
