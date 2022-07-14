import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { MessageUpdateDto } from './dto/message-update.dto';
import { MessageService } from './message.service';
import { MessageCreateProps } from './types';
import { createMessage } from './__test__/createMessage';

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

describe('_validateCollectUser', () => {
  it('return true if user match', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const message = await createMessage({
      content: '1',
      channelId: channel.id,
      userId: user.id,
      workspaceId: workspace.id,
    });

    const result = await messageService._validateCollectUser({
      id: message.id,
      userId: user.id,
    });

    expect(result).toEqual(true);
  });

  it('return false if user not match', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const message = await createMessage({
      content: '1',
      channelId: channel.id,
      userId: user.id,
      workspaceId: workspace.id,
    });

    const result = () =>
      messageService._validateCollectUser({
        id: message.id,
        userId: 'abcd',
      });

    await expect(result).rejects.toThrowError();
  });
});

describe('createMessage', () => {
  it('return message', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      name: faker.datatype.string(),
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const messageDto: MessageCreateProps = {
      content: '😊',
      channelId: channel.id,
      workspaceId: workspace.id,
    };

    const result = await messageService.createMessage(user, messageDto);

    expect(result).toEqual(
      expect.objectContaining({
        content: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userId: expect.any(String),
        workspaceId: expect.any(String),
        channelId: expect.any(String),
      }),
    );
  });
});

describe('updateMessage', () => {
  it('return message if success', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      name: faker.datatype.string(),
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const message = await createMessage({
      channelId: channel.id,
      content: '1',
      userId: user.id,
      workspaceId: workspace.id,
    });
    const updateDto: MessageUpdateDto = {
      content: '2',
      id: message.id,
    };

    const result = await messageService.updateMessage(user, updateDto);

    expect(result).toBeDefined();
  });

  it('throw forbidden error if not valid user', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      name: faker.datatype.string(),
      workspaceId: workspace.id,
    });
    const validUser = await createUser();
    const message = await createMessage({
      channelId: channel.id,
      content: '1',
      userId: validUser.id,
      workspaceId: workspace.id,
    });
    const invalidUser = await createUser();
    const updateDto: MessageUpdateDto = {
      content: '2',
      id: message.id,
    };

    const result = () => messageService.updateMessage(invalidUser, updateDto);

    await expect(result).rejects.toThrowError();
  });
});

describe('deleteMessage', () => {
  it('return true if success', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      name: faker.datatype.string(),
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const message = await createMessage({
      channelId: channel.id,
      content: '1',
      userId: user.id,
      workspaceId: workspace.id,
    });

    const result = await messageService.deleteMessage(user, message.id);

    expect(result).toEqual(true);
  });

  it('throw forbidden error if not valid user', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      name: faker.datatype.string(),
      workspaceId: workspace.id,
    });
    const validUser = await createUser();
    const message = await createMessage({
      channelId: channel.id,
      content: '1',
      userId: validUser.id,
      workspaceId: workspace.id,
    });
    const invalidUser = await createUser();

    const result = () => messageService.deleteMessage(invalidUser, message.id);

    await expect(result).rejects.toThrowError();
  });
});
