import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateWorkspaceProps {
  name: string;
}

export const createWorkspace = (data?: CreateWorkspaceProps) => {
  return prisma.workspace.create({
    data: {
      name: faker.datatype.string(),
      ...data,
    },
  });
};
