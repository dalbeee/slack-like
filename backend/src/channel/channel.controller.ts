import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ChannelService } from './channel.service';
import { ChannelCreateDto } from './dto/channel-create.dto';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  createChannel(@Body() data: ChannelCreateDto) {
    return this.channelService.createChannel(data);
  }

  @Get(':id')
  findChannelById(@Param('id') id: string) {
    return this.channelService.findChannelsById(id);
  }
}
