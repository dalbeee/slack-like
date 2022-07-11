import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { UserModule } from '@src/user/user.module';
import { createUser } from '@src/user/__test__/createUser';
import { WorkspaceModule } from '@src/workspace/workspace.module';
import { WorkspaceService } from '@src/workspace/workspace.service';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { InvitationService } from './invitation.service';
import { InvitationCreateProps } from './types';
import { createInvitations } from './__test__/createInvitations';

let app: TestingModule;
let prisma: PrismaService;
let invitationService: InvitationService;
let workspaceService: WorkspaceService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [UserModule, WorkspaceModule],
    providers: [PrismaService, InvitationService],
  }).compile();
  app = await moduleRef.init();
  prisma = app.get(PrismaService);
  invitationService = app.get(InvitationService);
  workspaceService = app.get(WorkspaceService);
});
beforeEach(async () => {
  await prisma.clearDatabase();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

describe('hasWorkspaceJoinedUser', () => {
  it('return true if user already joined', async () => {
    const workspace = await createWorkspace();
    const user = await createUser();
    const invitations = await createInvitations({
      inviterUserId: user.id,
      workspaceId: workspace.id,
      inviteeEmail: user.email,
    });
    await invitationService.activateInvitations(user, {
      activateCode: invitations.activateCode,
    });

    const result = await invitationService.hasWorkspaceJoinedUser(
      invitations.activateCode,
    );

    expect(result).toBeTruthy();
  });

  it('return false if user not joined', async () => {
    const workspace = await createWorkspace();
    const user = await createUser();
    const invitations = await createInvitations({
      inviterUserId: user.id,
      workspaceId: workspace.id,
      inviteeEmail: user.email,
    });

    const result = await invitationService.hasWorkspaceJoinedUser(
      invitations.activateCode,
    );

    expect(result).toBeFalsy();
  });
});

describe('createInvitations', () => {
  it('return invitation if success', async () => {
    const workspace = await createWorkspace();
    const inviter = await createUser();
    const data: InvitationCreateProps = {
      inviteeEmail: faker.internet.email(),

      workspaceId: workspace.id,
    };

    const result = await invitationService.createInvitations(inviter, data);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        inviterUserId: expect.any(String),
        inviteeEmail: expect.any(String),
        workspaceId: expect.any(String),
        activateCode: expect.any(String),
        expiredDate: expect.any(Date),
        createdAt: expect.any(Date),
      }),
    );
  });
});

describe('activateInvitations', () => {
  it('return true if success', async () => {
    const workspace = await createWorkspace();
    const user = await createUser();
    const invitations = await createInvitations({
      inviterUserId: user.id,
      workspaceId: workspace.id,
    });

    const result = await invitationService.activateInvitations(user, {
      activateCode: invitations.activateCode,
    });

    expect(result).toBeTruthy();
  });

  it('workspace has user', async () => {
    const workspace = await createWorkspace();
    const user = await createUser();
    const invitations = await createInvitations({
      inviterUserId: user.id,
      workspaceId: workspace.id,
    });
    await invitationService.activateInvitations(user, {
      activateCode: invitations.activateCode,
    });

    const result = await workspaceService._hasWorkspaceJoinedUser({
      userId: user.id,
      workspaceId: workspace.id,
    });

    expect(result).toBeTruthy();
  });

  //   it('return false if expired date', async () => {});
});
