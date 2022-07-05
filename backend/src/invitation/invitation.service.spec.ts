import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { InvitationService } from './invitation.service';
import { InvitationCreateProps } from './types';

let app: TestingModule;
let prisma: PrismaService;
let invitationService: InvitationService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [PrismaService, InvitationService],
  }).compile();
  app = await moduleRef.init();
  prisma = app.get(PrismaService);
  invitationService = app.get(InvitationService);
});
beforeEach(async () => {
  await prisma.clearDatabase();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

describe('createInvitation', () => {
  it('return invitation if success', async () => {
    const workspace = await createWorkspace();
    const inviter = await createUser();
    const invitee = await createUser();
    const data: InvitationCreateProps = {
      inviteeUserId: invitee.id,
      inviterUserId: inviter.id,
      workspaceId: workspace.id,
    };

    const result = await invitationService.createInvitations(data);

    console.log(result);
    expect(result).toBeDefined();
  });
});
