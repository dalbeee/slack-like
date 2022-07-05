import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async createChannel(dto: ChannelCreateDto) {
    const { workspaceId, ...data } = dto;
    const existChannel = await this.prisma.channel.findFirst({
      where: { name: data.name },
    });
    if (existChannel) throw new ConflictException('already exist channel');

    return this.prisma.channel.create({
      data: {
        ...data,
        WorkSpace: { connect: { id: workspaceId } },
      },
    });
  }

  async findChannelsById(id: string) {
    const channel = await this.prisma.channel.findFirst({ where: { id } });
    if (!channel) throw new NotFoundException();
    return channel;
  }
}
