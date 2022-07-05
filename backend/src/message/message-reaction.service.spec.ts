import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageReactionService } from './message-reaction.service';

let app: TestingModule;
let messageReactionService: MessageReactionService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [MessageReactionService, PrismaService],
  }).compile();
  app = await moduleRef.init();
  messageReactionService = app.get(MessageReactionService);
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

    const result = await messageReactionService.create(messageDto);

    expect(result).toEqual(
      expect.objectContaining({
        userId: expect.any(String),
        messageId: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(Date),
      }),
    );
  });

  it('return array.length=2 if create two reactions', async () => {
    const message = await createMessage({ content: 'hello' });
    const user = await createUser();
    const messageDto: MessageCreateDto = {
      content: '😊',
      messageId: message.id,
      userId: user.id,
    };
    await messageReactionService.create(messageDto);
    await messageReactionService.create({
      ...messageDto,
      content: '😍',
    });

    const result = await messageReactionService.findByUserAndMessage({
      messageId: message.id,
      userId: user.id,
    });

    expect(result.length).toEqual(2);
  });
});

describe('delete', () => {
  it('return array.length=0 if delete reaction', async () => {
    const message = await createMessage({ content: 'hello' });
    const user = await createUser();
    const messageDto: MessageCreateDto = {
      content: '😊',
      messageId: message.id,
      userId: user.id,
    };
    await messageReactionService.create(messageDto);
    await messageReactionService.delete(messageDto);

    const result = await messageReactionService.findByUserAndMessage({
      messageId: message.id,
      userId: user.id,
    });

    expect(result.length).toEqual(0);
  });
});
