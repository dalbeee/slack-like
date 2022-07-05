import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { WorkspaceCreateDto } from './dto/workspace-create.dto';
import { WorkspaceService } from './workspace.service';

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
