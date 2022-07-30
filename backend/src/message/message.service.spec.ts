import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageUpdateDto } from './dto/message-update.dto';
import { MessageModule } from './message.module';
import { MessageService } from './message.service';
import { createMessage } from './__test__/createMessage';

let app: TestingModule;
let messageService: MessageService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [MessageModule],
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

describe('createItem', () => {
  it('return Message', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      name: faker.datatype.string(),
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const messageDto: MessageCreateDto = {
      content: '😊',
      channelId: channel.id,
      workspaceId: workspace.id,
    };

    const result = await messageService.createItem(user, messageDto);

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

describe('updateItem', () => {
  it('return Message', async () => {
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

    const result = await messageService.updateItem(user, updateDto);

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

    const result = () => messageService.updateItem(invalidUser, updateDto);

    await expect(result).rejects.toThrowError();
  });
});

describe('deleteItem', () => {
  it('return true', async () => {
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

    const result = await messageService.deleteItem(user, message.id);

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

    const result = () => messageService.deleteItem(invalidUser, message.id);

    await expect(result).rejects.toThrowError();
  });
});
