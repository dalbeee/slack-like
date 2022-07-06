import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { createUser } from '@src/user/__test__/createUser';
import { WorkspaceCreateDto } from './dto/workspace-create.dto';
import { WorkspaceService } from './workspace.service';
import { createWorkspace } from './__test__/createWorkspace';

let app: TestingModule;
let prisma: PrismaService;
let workspaceService: WorkspaceService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [PrismaService, WorkspaceService],
  }).compile();
  app = await moduleRef.init();
  prisma = app.get(PrismaService);
  workspaceService = app.get(WorkspaceService);
});
afterEach(async () => {
  await prisma.clearDatabase();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

describe('createWorkspace', () => {
  it('return workspace if success', async () => {
    const dto: WorkspaceCreateDto = {
      name: faker.datatype.string(20),
    };

    const result = await workspaceService.createWorkspace(dto);

    expect(result).toEqual(
      expect.objectContaining({ name: expect.any(String) }),
    );
  });
});

describe('_hasWorkspaceJoinedUser', () => {
  it('return true if already joined user', async () => {
    const workspace = await createWorkspace();
    const user = await createUser();
    await workspaceService.joinMember({
      userId: user.id,
      workspaceId: workspace.id,
    });

    const result = await workspaceService._hasWorkspaceJoinedUser({
      userId: user.id,
      workspaceId: workspace.id,
    });

    expect(result).toBeTruthy();
  });
  it('return false if not joined user', async () => {
    const workspace = await createWorkspace();
    const user = await createUser();

    const result = await workspaceService._hasWorkspaceJoinedUser({
      userId: user.id,
      workspaceId: workspace.id,
    });

    expect(result).toBeFalsy();
  });
});

describe('joinMember', () => {
  it('return value if success', async () => {
    const workspace = await createWorkspace();
    const user = await createUser();

    const result = await workspaceService.joinMember({
      workspaceId: workspace.id,
      userId: user.id,
    });

    expect(result).toBeTruthy();
  });
});
