import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { WorkspaceCreateDto } from './dto/workspace-create.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  _findWorkspaceByName(name: string) {
    return this.prisma.workspace.findFirst({
      where: { name },
    });
  }

  async createWorkspace(data: WorkspaceCreateDto) {
    const existName = await this._findWorkspaceByName(data.name);
    if (existName) throw new ConflictException('already exist name');
    return this.prisma.workspace.create({ data });
  }

  findWorkspaces() {
    return this.prisma.workspace.findMany({});
  }

  findWorkspaceByName(name: string) {
    return this.prisma.workspace.findFirst({
      where: { name },
      include: { channels: true },
    });
  }
}
