import { faker } from '@faker-js/faker';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageUpdateDto } from './dto/message-update.dto';
import { MessageModule } from './message.module';
import { MessageService } from './message.service';
import { createComment } from './__test__/createComment';
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
  await app.close();
});

describe('__test__/createMessage', () => {
  it('is valid', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();
    const result = await createMessage({
      content: 'content',
      workspace,
      channel,
      user,
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });
});

describe('__test__/createComment', () => {
  it('is valid', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();
    const message = await createMessage({
      workspace,
      channel,
      user,
    });

    const result = await createComment({ workspace, channel, user, message });

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });
});

describe('_validateCorrectUser', () => {
  it('return Message if user match', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const message = await createMessage({
      content: '1',
      workspace,
      channel,
      user,
    });

    const result = await messageService._validateCorrectUser({
      id: message.id,
      userId: user.id,
    });

    expect(result.id).toBeDefined();
  });

  it('throw error if user not match', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const message = await createMessage({
      content: '1',
      workspace,
      channel,
      user,
    });

    const result = () =>
      messageService._validateCorrectUser({
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

  it('return Message when exist ancestor Message', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();
    const ancestor = await createMessage({ workspace, channel, user });
    const commentDto: MessageCreateDto = {
      workspaceId: workspace.id,
      channelId: channel.id,
      content: 'comment',
      ancestorId: ancestor.id,
    };

    const result = await messageService.createItem(user, commentDto);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ancestorId: expect.any(String),
        commentsCount: 0,
      }),
    );
  });

  it('ancestorMessage has increase commentsCount when comment created', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();
    const ancestor = await createMessage({ workspace, channel, user });
    const commentDto: MessageCreateDto = {
      workspaceId: workspace.id,
      channelId: channel.id,
      content: 'comment',
      ancestorId: ancestor.id,
    };
    await messageService.createItem(user, commentDto);

    const result = await messageService.findById(ancestor.id);

    expect(result.commentsCount).toEqual(1);
  });

  it('throw error if nested comment', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const ancestor = await createMessage({ workspace, channel, user });
    const comment = await createComment({
      workspace,
      channel,
      user,
      message: ancestor,
    });

    const nestedCommentDto: MessageCreateDto = {
      content: 'nested comment',
      channelId: channel.id,
      workspaceId: workspace.id,
      ancestorId: comment.id,
    };

    const result = () => messageService.createItem(user, nestedCommentDto);

    await expect(result).rejects.toThrowError(
      new BadRequestException('comments cannot be nested'),
    );
  });

  it('throw error if ancestor not exist when create comment', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const fakeAncestorId = 'fake';
    const nestedCommentDto: MessageCreateDto = {
      content: 'nested comment',
      channelId: channel.id,
      workspaceId: workspace.id,
      ancestorId: fakeAncestorId,
    };

    const result = () => messageService.createItem(user, nestedCommentDto);

    await expect(result).rejects.toThrowError(
      new BadRequestException('Ancestor message not found'),
    );
  });
});

describe('updateItem', () => {
  it('return Message if update content', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const message = await createMessage({
      workspace,
      channel,
      user,
      content: 'message',
    });
    const updateDto: MessageUpdateDto = {
      content: 'updated',
      id: message.id,
    };

    const result = await messageService.updateItem(user, updateDto);

    expect(result.content).toEqual('updated');
  });

  it('throw forbidden error if not valid user', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const validUser = await createUser();
    const invalidUser = await createUser();
    const message = await createMessage({
      workspace,
      channel,
      user: validUser,
      content: 'content',
    });
    const updateDto: MessageUpdateDto = {
      content: 'update',
      id: message.id,
    };

    const result = () => messageService.updateItem(invalidUser, updateDto);

    await expect(result).rejects.toThrowError(ForbiddenException);
  });
});

describe('deleteItem', () => {
  it('return true', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const message = await createMessage({
      workspace,
      channel,
      user,
      content: '1',
    });

    const result = await messageService.deleteItem(user, message.id);

    expect(result.id).toBeDefined();
  });

  it('throw forbidden error if not valid user', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const validUser = await createUser();
    const invalidUser = await createUser();
    const message = await createMessage({
      workspace,
      channel,
      user: validUser,
      content: 'content',
    });

    const result = () => messageService.deleteItem(invalidUser, message.id);

    await expect(result).rejects.toThrowError(ForbiddenException);
  });

  it('throw error when invalid user', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const validUser = await createUser();
    const invalidUser = await createUser();
    const message = await createMessage({
      workspace,
      channel,
      user: validUser,
      content: '1',
    });

    const result = () => messageService.deleteItem(invalidUser, message.id);

    await expect(result).rejects.toThrowError(ForbiddenException);
  });

  it('has changed ancestor.commentsCount when comment delete', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({
      workspaceId: workspace.id,
    });
    const user = await createUser();
    const message = await createMessage({
      workspace,
      channel,
      user,
      content: '1',
    });
    const comment = await createComment({ workspace, channel, user, message });
    await messageService.deleteItem(user, comment.id);

    const result = await messageService.findById(message.id);

    expect(result.commentsCount).toEqual(0);
  });
});
