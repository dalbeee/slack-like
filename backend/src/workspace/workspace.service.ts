import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

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

  async _hasWorkspaceJoinedUser({
    userId,
    workspaceId: worksapceId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    const result = await this.prisma.workspace.findFirst({
      include: { users: true },
      where: { id: worksapceId, users: { some: { id: userId } } },
    });
    return result ? true : false;
  }

  async createWorkspace(data: WorkspaceCreateDto) {
    const existName = await this._findWorkspaceByName(data.name);
    if (existName) throw new ConflictException('already exist name');
    return this.prisma.workspace.create({ data });
  }

  findWorkspaceById(id: string) {
    return this.prisma.workspace.findUnique({ where: { id } });
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

  async joinMember({
    userId,
    workspaceId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    const hasAlreadyJoinedUser = await this._hasWorkspaceJoinedUser({
      userId,
      workspaceId,
    });
    if (hasAlreadyJoinedUser) return true;

    try {
      await this.prisma.workspace.update({
        where: { id: workspaceId },
        data: { users: { connect: { id: userId } } },
      });
      return true;
    } catch (error) {
      throw new BadRequestException('not valid invitation code');
    }
  }
}
