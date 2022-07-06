import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

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
  invitationService.createInvitations({
    inviteeEmail: data?.inviteeEmail ?? faker.internet.email(),
    ...data,
  });
