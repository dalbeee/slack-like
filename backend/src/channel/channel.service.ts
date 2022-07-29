import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { WorkspaceService } from '@src/workspace/workspace.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async createChannel(dto: ChannelCreateDto) {
    const { workspaceId, ...data } = dto;
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
        WorkSpace: { connect: { id: workspaceId } },
      },
    });
  }

  async subscribeChannel(userId: string, channelId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId },
    });
    if (!channel) throw new NotFoundException();
    const result = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        Users: { connect: { id: userId } },
      },
    });
    return result;
  }

  async unsubscribeChannel(userId: string, channelId: string) {
    const result = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        Users: { disconnect: { id: userId } },
      },
    });
    return result;
  }

  async findChannelsById(channelId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId },
      include: { Messages: true, Users: true },
    });
    if (!channel) throw new NotFoundException();
    return channel;
  }

  async findchannelsByWorkspaceId(workspaceId: string) {
    return this.prisma.channel.findMany({
      where: { workspaceId },
      include: { Users: true },
    });
  }
}
