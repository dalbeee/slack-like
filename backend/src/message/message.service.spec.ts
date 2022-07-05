import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/prisma.service';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageService } from './message.service';

let app: TestingModule;
let messageService: MessageService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [MessageService, PrismaService],
  }).compile();
  app = await moduleRef.init();
  messageService = app.get(MessageService);
  prisma = app.get(PrismaService);
});

afterEach(async () => {
  await prisma.clearDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

const createMessage = ({ content }: { content: string }) => {
  return prisma.message.create({
    data: { content },
  });
};

const createUser = () => {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.datatype.string(20),
      password: faker.datatype.string(20),
    },
  });
};

describe('createMessage', () => {
  it('return message', async () => {
    const message = await createMessage({ content: 'hello' });
    const user = await createUser();
    const messageDto: MessageCreateDto = {
      content: '😊',
      messageId: message.id,
      userId: user.id,
    };

    // const result = await
  });
});
