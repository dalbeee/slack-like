import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ChannelService } from './channel.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

@Controller('/:workspace')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  createChannel(
    @Param('workspace') workspaceId: string,
    @Body() data: ChannelCreateDto,
  ) {
    return this.channelService.createChannel({ ...data, workspaceId });
  }

  @Get(':channelId')
  findChannelById(
    @Param('channelId') channelId: string,
    @Param('workspace') workspaceId: string,
  ) {
    return this.channelService.findChannelsById({ workspaceId, channelId });
  }

  @Get()
  findChannelsByWorkspaceId(@Param('workspace') workspaceId: string) {
    return this.channelService.findchannelsByWorkspaceId(workspaceId);
  }
}
