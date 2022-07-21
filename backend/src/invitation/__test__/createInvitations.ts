import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { UserJwtPayload } from '@src/auth/types';

import { PrismaService } from '@src/prisma.service';
import { UserService } from '@src/user/user.service';
import { WorkspaceService } from '@src/workspace/workspace.service';
import { InvitationService } from '../invitation.service';

const prisma = new PrismaClient() as PrismaService;
const userService = new UserService(prisma);
const workspaceService = new WorkspaceService(prisma);
const invitationService = new InvitationService(
  prisma,
  userService,
  workspaceService,
);

type InvitationCreateProps = {
  workspaceId: string;
  inviterUserId: string;
  inviteeEmail?: string;
};

export const createInvitations = async (data: InvitationCreateProps) => {
  return await invitationService.createInvitations(
    { id: data.inviterUserId } as UserJwtPayload,
    {
      inviteeEmail: data?.inviteeEmail ?? faker.internet.email(),
      ...data,
    },
  );
};
