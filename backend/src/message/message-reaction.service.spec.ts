import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';
import { MessageReactionService } from './message-reaction.service';
import { createMessage } from './__test__/createMessage';

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

describe('createMessage', () => {
  it('return message', async () => {
    const user = await createUser();
    const workspace = await createWorkspace({
      name: faker.datatype.string(10),
    });
    const channel = await createChannel({
      name: faker.datatype.string(10),
      workspaceId: workspace.id,
    });
    const message = await createMessage({
      content: 'hello',
      userId: user.id,
      channelId: channel.id,
      workspaceId: workspace.id,
    });
    const messageDto: MessageReactionCreateDto = {
      content: '😊',
      userId: user.id,
      messageId: message.id,
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
    const user = await createUser();
    const workspace = await createWorkspace({
      name: faker.datatype.string(10),
    });
    const channel = await createChannel({
      name: faker.datatype.string(10),
      workspaceId: workspace.id,
    });
    const message = await createMessage({
      content: 'hello',
      userId: user.id,
      channelId: channel.id,
      workspaceId: workspace.id,
    });
    const messageDto: MessageReactionCreateDto = {
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
    const user = await createUser();
    const workspace = await createWorkspace({
      name: faker.datatype.string(10),
    });
    const channel = await createChannel({
      name: faker.datatype.string(10),
      workspaceId: workspace.id,
    });
    const message = await createMessage({
      content: 'hello',
      userId: user.id,
      channelId: channel.id,
      workspaceId: workspace.id,
    });
    const messageDto: MessageReactionCreateDto = {
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
