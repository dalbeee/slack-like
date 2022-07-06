import { PrismaService } from '../src/prisma.service';

const clearDB = async () => {
  if (process.env.NODE_ENV === 'production') throw Error('run only dev mode');
  const prisma = new PrismaService();
  await prisma.clearDatabase();
};

clearDB();
