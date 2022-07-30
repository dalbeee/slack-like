import { Test, TestingModule } from '@nestjs/testing';

import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';
import { MessageReactionService } from './message-reaction.service';
import { MessageModule } from './message.module';
import { createMessage } from './__test__/createMessage';
import { createMessageReaction } from './__test__/createMessageReaction';

let app: TestingModule;
let messageReactionService: MessageReactionService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [MessageModule],
  }).compile();
  app = await moduleRef.init();
  messageReactionService = app.get(MessageReactionService);
  prisma = app.get(PrismaService);
});

afterEach(async () => {
  await prisma.clearDatabase();
});

afterAll(async () => {
  await app.close();
});

describe('createItem', () => {
  it('return MessageReaction', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const message = await createMessage({
      content: 'hello',
      userId: user.id,
      channelId: channel.id,
      workspaceId: workspace.id,
    });
    const dto: MessageReactionCreateDto = {
      content: '😊',
      userId: user.id,
      messageId: message.id,
    };

    const result = await messageReactionService.createItem(dto);

    expect(result).toEqual(
      expect.objectContaining({
        userId: expect.any(String),
        messageId: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(Date),
      }),
    );
  });

  it('throw error if content length not 1', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const message = await createMessage({
      content: 'hello',
      userId: user.id,
      channelId: channel.id,
      workspaceId: workspace.id,
    });
    const dto: MessageReactionCreateDto = {
      content: '😊😊',
      messageId: message.id,
      userId: user.id,
    };

    const result = messageReactionService.createItem(dto);

    await expect(result).rejects.toThrowError();
  });
});

describe('deleteItem', () => {
  it('return MessageReaction', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const message = await createMessage({
      content: 'hello',
      userId: user.id,
      channelId: channel.id,
      workspaceId: workspace.id,
    });
    const createDto: MessageReactionCreateDto = {
      content: '😊',
      messageId: message.id,
      userId: user.id,
    };
    const reaction = await messageReactionService.createItem(createDto);

    const result = await messageReactionService.deleteItem(user, reaction.id);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: expect.any(String),
      }),
    );
  });

  it('throw error if invalid author', async () => {
    const user = await createUser();
    const invalid_user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const message = await createMessage({
      content: 'hello',
      userId: user.id,
      channelId: channel.id,
      workspaceId: workspace.id,
    });
    const createDto: MessageReactionCreateDto = {
      content: '😊',
      messageId: message.id,
      userId: user.id,
    };
    const reaction = await messageReactionService.createItem(createDto);

    const result = () =>
      messageReactionService.deleteItem(invalid_user, reaction.id);

    await expect(result).rejects.toThrowError();
  });
});

describe('findManyByMessageId', () => {
  it('return MessageReaction', async () => {
    const { messageReaction, message } = await createMessageReaction();

    const result = await messageReactionService.findManyByMessageId(message.id);

    expect(messageReaction).toBeDefined();
    expect(result.length).toEqual(1);
  });
});
