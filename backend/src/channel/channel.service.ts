import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';

import { PrismaService } from '@src/prisma.service';
import { UserService } from '@src/user/user.service';
import { WorkspaceService } from '@src/workspace/workspace.service';
import { ChannelCreateDirectMesageDto } from './dto/channel-create-dm.dto';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelFindDirectMesageDto } from './dto/channel-find-dm.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceService: WorkspaceService,
    private readonly userService: UserService,
  ) {}

  async createChannel(dto: ChannelCreateDto) {
    const { workspaceId, isPrivate, password, ...data } = dto;

    if (isPrivate && !password)
      throw new BadRequestException('password is required');

    const workspace = await this.workspaceService.findWorkspaceById(
      workspaceId,
    );
    if (!workspace) throw new NotFoundException('not found workspace');

    const existChannel = await this.prisma.channel.findFirst({
      where: { workspaceId, name: data.name },
    });

    if (existChannel) throw new ConflictException('already exist channel');

    return this.prisma.channel.create({
      data: {
        ...data,
        password: isPrivate ? password : undefined,
        type: isPrivate ? 'PRIVATE' : 'PUBLIC',
        WorkSpace: { connect: { id: workspaceId } },
      },
    });
  }

  async subscribeChannel(userId: string, channelId: string) {
    const result = await this._isDMChannel(channelId);
    if (result) throw new NotFoundException();
    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        Users: { connect: { id: userId } },
      },
    });
    return updatedChannel;
  }

  async unsubscribeChannel(userId: string, channelId: string) {
    const result = await this._isDMChannel(channelId);
    if (result) throw new NotFoundException();
    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        Users: { disconnect: { id: userId } },
      },
    });
    return updatedChannel;
  }

  async findChannelById(channelId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId },
      include: { Messages: { include: { reactions: true } }, Users: true },
    });
    if (!channel) throw new NotFoundException();
    return channel;
  }

  async findchannelsByWorkspaceId(workspaceId: string) {
    return this.prisma.channel.findMany({
      where: { workspaceId, NOT: { type: 'DIRECT_MESSAGE' } },
      include: { Users: true },
    });
  }

  // DM
  async _isDMChannel(channelId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId },
    });
    return channel.type === 'DIRECT_MESSAGE' ? true : false;
  }

  async _createDirectMessageChannel(dto: ChannelCreateDirectMesageDto) {
    const { workspaceId, userIds, ...data } = dto;
    const workspace = await this.workspaceService.findWorkspaceById(
      workspaceId,
    );
    if (!workspace) throw new NotFoundException('not found workspace');

    const existUsers = await Promise.all(
      userIds.map((userId) => this.userService.findUserById(userId)),
    );
    if (
      !existUsers ||
      existUsers.length !== userIds.length ||
      existUsers.every((user) => !user)
    )
      throw new BadRequestException('invalid userIds');

    return this.prisma.channel.create({
      data: {
        ...data,
        name: `dm-${nanoid(9)}`,
        type: 'DIRECT_MESSAGE',
        WorkSpace: { connect: { id: workspaceId } },
        Users: { connect: [{ id: userIds[0] }, { id: userIds[1] }] },
      },
      include: { Users: true, Messages: true },
    });
  }

  async findDMChannelByUserIds(dto: ChannelFindDirectMesageDto) {
    const { userIds, workspaceId } = dto;
    const channel = await this.prisma.channel.findFirst({
      where: {
        workspaceId,
        type: 'DIRECT_MESSAGE',
        AND: [
          { Users: { some: { id: userIds[0] } } },
          { Users: { some: { id: userIds[1] } } },
        ],
      },
      include: { Messages: true, Users: true },
    });
    if (channel) return channel;
    return this._createDirectMessageChannel(dto);
  }

  async findManyDMChannelsByUserId(userId: string) {
    return this.prisma.channel.findMany({
      where: { type: 'DIRECT_MESSAGE', Users: { some: { id: userId } } },
      include: {
        Users: true,
        Messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }
}
