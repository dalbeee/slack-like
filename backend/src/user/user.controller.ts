import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { UserService } from '@src/user/user.service';
import { UserCreateDto } from '@src/user/dto/user-create.dto';
import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';
import { UserRedisService } from './user-redis.service';
import { PublicPermission } from '@src/auth/decorator/public-permission.decorator';
import { SubscribedChannelsDto } from './dto/subscribed-channels.dto';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRedisService: UserRedisService,
  ) {}

  @PublicPermission()
  @Post()
  createUser(@Body() user: UserCreateDto) {
    return this.userService.createUser(user);
  }

  @Get('/joined-workspaces')
  async findWorkspacesByUserId(@CurrentUser() user: UserJwtPayload) {
    const result = await this.userService.findWorkspacesByUserId(user.id);
    return result.workspaces;
  }

  @Get('/subscribed-channels')
  async findUserWithSubscriptions(
    @Query() { workspaceId }: SubscribedChannelsDto,
    @CurrentUser() user: UserJwtPayload,
  ) {
    const getChannels = () =>
      this.userService.findSubscribedChannelsByWorkspaceIdAndUserId(
        user.id,
        workspaceId,
      );
    const getChannelMetadatas = () =>
      this.userRedisService.getChannelDataAll(user.id, workspaceId);
    const [channels, metadatas] = await Promise.all([
      getChannels(),
      getChannelMetadatas(),
    ]);
    const result = channels.map((channel) => ({
      ...channel,
      ...metadatas[channel.id],
    }));

    return { workspaceId, channels: result };
  }

  @Get()
  findUsers() {
    return this.userService.findAll();
  }
}
