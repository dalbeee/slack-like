import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { UserJwtPayload } from '@src/auth/types';

import { PrismaService } from '@src/prisma.service';
import { InvitationService } from '../invitation.service';
// import { InvitationCreateProps } from '../types';

const prisma = new PrismaClient() as PrismaService;
const invitationService = new InvitationService(prisma, null, null);

type InvitationCreateProps = {
  workspaceId: string;
  inviterUserId: string;
  inviteeEmail?: string;
};

export const createInvitations = (data: InvitationCreateProps) =>
  invitationService.createInvitations(
    { id: data.inviterUserId } as UserJwtPayload,
    {
      inviteeEmail: data?.inviteeEmail ?? faker.internet.email(),
      ...data,
    },
  );
