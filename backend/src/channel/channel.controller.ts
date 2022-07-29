import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';

import { ChannelService } from './channel.service';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { ChannelSubscribeDto } from './dto/channel-subscribe.dto';

@Controller('/channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  createChannel(@Body() data: ChannelCreateDto) {
    return this.channelService.createChannel(data);
  }

  @Post('/subscribe')
  subscribeChannel(
    @Query() { channelId }: ChannelSubscribeDto,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.channelService.subscribeChannel(user.id, channelId);
  }

  @Post('/unsubscribe')
  unsubscribeChannel(
    @Query() { channelId }: ChannelSubscribeDto,
    @CurrentUser() user: UserJwtPayload,
  ) {
    return this.channelService.unsubscribeChannel(user.id, channelId);
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
