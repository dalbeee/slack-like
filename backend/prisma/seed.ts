import { Channel, PrismaClient, User, Workspace } from '@prisma/client';

import { ChannelService } from '../src/channel/channel.service';
import { PrismaService } from '../src/prisma.service';
import { WorkspaceService } from '../src/workspace/workspace.service';
import { UserService } from '../src/user/user.service';

if (process.env.NODE_ENV === 'production') throw Error('run only dev mode');

const prismaClient = new PrismaClient() as PrismaService;
const userService = new UserService(prismaClient);
const workspaceService = new WorkspaceService(prismaClient);
const channelService = new ChannelService(
  prismaClient,
  workspaceService,
  userService,
);

const createWorkspaces = async () => {
  const workspace1 = await workspaceService.createWorkspace({
    name: 'workspace-1',
  });
  const workspace2 = await workspaceService.createWorkspace({
    name: 'workspace-2',
  });
  return [workspace1, workspace2];
};

const createChannels = async ({ workspaces }: { workspaces: Workspace[] }) => {
  const channel1 = await channelService.createChannel({
    name: 'channel-1',
    workspaceId: workspaces[0].id,
  });
  const channel2 = await channelService.createChannel({
    name: 'channel-2',
    workspaceId: workspaces[0].id,
  });
  const channel3 = await channelService.createChannel({
    name: 'channel-3',
    workspaceId: workspaces[0].id,
  });
  const channel4 = await channelService.createChannel({
    name: 'channel-4',
    workspaceId: workspaces[0].id,
  });
  return [channel1, channel2, channel3, channel4];
};

const createUsers = async ({ workspaces }: { workspaces: Workspace[] }) => {
  const user1 = await userService.createUser({
    email: 'test1@test.test',
    name: 'test1',
    password: '123456',
  });
  const user2 = await userService.createUser({
    email: 'test2@test.test',
    name: 'test2',
    password: '123456',
  });
  const user3 = await userService.createUser({
    email: 'test3@test.test',
    name: 'test3',
    password: '123456',
  });
  await workspaceService.joinMember({
    userId: user1.id,
    workspaceId: workspaces[0].id,
  });
  await workspaceService.joinMember({
    userId: user2.id,
    workspaceId: workspaces[0].id,
  });
  return [user1, user2, user3];
};

const channelSubscribe = (user: User, channels: Channel[]) => {
  channels.map((channel) => {
    channelService.subscribeChannel(user.id, channel.id);
  });
};

const main = async () => {
  const workspaces = await createWorkspaces();
  const channels = await createChannels({ workspaces });
  const users = await createUsers({ workspaces });
  channelSubscribe(users[0], channels);
  channelSubscribe(users[1], channels);
  channelSubscribe(users[2], channels);
};

main();
