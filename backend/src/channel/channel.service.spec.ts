import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { ChannelModule } from './channel.module';
import { ChannelService } from './channel.service';
import { ChannelCreateDirectMesageDto } from './dto/channel-create-dm.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { createChannel } from './__test__/createChannel';

let app: TestingModule;
let prismaService: PrismaService;
let channelService: ChannelService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [ChannelModule],
  }).compile();
  app = await moduleRef.init();
  prismaService = app.get(PrismaService);
  channelService = app.get(ChannelService);
});
afterEach(async () => {
  await prismaService.clearDatabase();
});
afterAll(async () => {
  await app.close();
});

describe('createChannel', () => {
  it('public channel hasnt password', async () => {
    const workspace = await createWorkspace();
    const dto: ChannelCreateDto = {
      name: 'test',
      workspaceId: workspace.id,
      password: 'test',
    };

    const result = await channelService.createChannel(dto);

    expect(result.password).toBeNull();
  });

  it('private channel has password', async () => {
    const workspace = await createWorkspace();
    const dto: ChannelCreateDto = {
      name: 'test',
      workspaceId: workspace.id,
      isPrivate: true,
      password: 'test',
    };

    const result = await channelService.createChannel(dto);

    expect(result.password).toBeDefined();
  });
});

describe('subscribeChannel', () => {
  it('return channel', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();

    const result = await channelService.subscribeChannel(user.id, channel.id);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        workspaceId: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('throw notfoundexcection if notfound channel', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const userId = 'fake_userId';

    const result = () => channelService.subscribeChannel(userId, channel.id);

    await expect(result).rejects.toThrowError();
  });

  it('throw notfoundexcection if channel is directMessage type', async () => {
    const workspace = await createWorkspace();
    const users = await Promise.all([await createUser(), await createUser()]);
    const userIds = users.map((user) => user.id);
    const dto: ChannelCreateDirectMesageDto = {
      userIds,
      workspaceId: workspace.id,
    };
    const channel = await channelService.findDMChannelByUserIds(dto);

    const result = () =>
      channelService.subscribeChannel(userIds[0], channel.id);

    await expect(result).rejects.toThrowError();
  });
});

describe('unsubscribeChannel', () => {
  it('return channel', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();

    await channelService.subscribeChannel(user.id, channel.id);

    const result = await channelService.unsubscribeChannel(user.id, channel.id);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        workspaceId: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

    const channelAfter = await channelService.findChannelById(channel.id);
    expect(channelAfter.users).not.toContain(user);
  });
});

// DM
describe('_createDirectMessageChannel', () => {
  it('return channel', async () => {
    const users = await Promise.all([await createUser(), await createUser()]);
    const workspace = await createWorkspace();

    const result = await channelService._createDirectMessageChannel({
      userIds: [users[0].id, users[1].id],
      workspaceId: workspace.id,
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        type: 'DIRECT_MESSAGE',
      }),
    );
  });

  it('return exist channel if  already exist channel', async () => {
    const users = await Promise.all([await createUser(), await createUser()]);
    const workspace = await createWorkspace();
    await channelService._createDirectMessageChannel({
      userIds: [users[0].id, users[1].id],
      workspaceId: workspace.id,
    });

    const result = await channelService._createDirectMessageChannel({
      userIds: [users[0].id, users[1].id],
      workspaceId: workspace.id,
    });

    expect(result).toBeDefined();
  });
});

describe('findDMChannelByUserIds', () => {
  it('create channel and return if channel is not exist', async () => {
    const users = await Promise.all([await createUser(), await createUser()]);
    const userIds = users.map((user) => user.id);
    const workspace = await createWorkspace();

    const result = await channelService.findDMChannelByUserIds({
      userIds,
      workspaceId: workspace.id,
    });

    expect(result).toBeDefined();
  });
});
