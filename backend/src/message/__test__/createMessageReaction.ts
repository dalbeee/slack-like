import { faker } from '@faker-js/faker';

import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { createMessage } from './createMessage';

const prisma = new PrismaService();

export const createMessageReaction = async () => {
  const user = await createUser();
  const workspace = await createWorkspace();
  const channel = await createChannel({
    workspaceId: workspace.id,
  });
  const message = await createMessage({
    content: faker.datatype.string(10),
    userId: user.id,
    channelId: channel.id,
    workspaceId: workspace.id,
  });
  const messageReaction = await prisma.messageReaction.create({
    data: { content: '😊', messageId: message.id, userId: user.id },
  });
  return { user, workspace, channel, message, messageReaction };
};
