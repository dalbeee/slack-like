import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = () => {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.datatype.string(20),
      password: faker.datatype.string(20),
    },
  });
};
