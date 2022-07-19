import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import { ChannelService } from './channel.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

@Controller('/channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  createChannel(@Body() data: ChannelCreateDto) {
    return this.channelService.createChannel(data);
  }

  @Get()
  findChannelsByWorkspaceId(
    @Query('workspaceId') workspaceId: string,
    @Query('channelId') channelId: string,
  ) {
    if (workspaceId)
      return this.channelService.findchannelsByWorkspaceId(workspaceId);
    if (channelId) return this.channelService.findChannelsById(channelId);
    throw new BadRequestException();
  }
}
