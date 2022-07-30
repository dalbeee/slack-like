import { Injectable } from '@nestjs/common';

import { UserRedisService } from '@src/user/user-redis.service';
import { ChannelSpecificDto } from './dto/channel-specific.dto';

@Injectable()
export class SocketIoInboudService {
  constructor(private readonly userRedisService: UserRedisService) {}

  increaseUnreadMessageCount(channelDto: ChannelSpecificDto) {
    return this.userRedisService.increaseUnreadMessageCount(channelDto);
  }

  setZeroUnreadMessageCount(channelDto: ChannelSpecificDto) {
    return this.userRedisService.setZeroUnreadMessageCount(channelDto);
  }
}
