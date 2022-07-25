import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { ChannelModule } from './channel.module';
import { ChannelService } from './channel.service';
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

describe('subscribeChannel', () => {
  it('return true if success', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();

    const result = await channelService.subscribeChannel(user.id, channel.id);

    expect(result).toEqual(true);
  });

  it('throw notfoundexcection if notfound channel', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const userId = 'fake_userId';

    const result = () => channelService.subscribeChannel(userId, channel.id);

    await expect(result).rejects.toThrowError();
  });
});