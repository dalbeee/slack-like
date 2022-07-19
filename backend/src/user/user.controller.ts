import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { UserService } from '@src/user/user.service';
import { UserCreateDto } from '@src/user/dto/user-create.dto';
import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';
import { UserRedisService } from './user.redis-service';
import { PublicPermission } from '@src/auth/decorator/public-permission.decorator';

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

  @Get('/metadata')
  findWorkspaceChannelMetadataByName(
    @CurrentUser() user: UserJwtPayload,
    @Query('workspaceId') workspaceId: string,
  ) {
    return this.userRedisService.getChannelDataAll(user.id, workspaceId);
  }

  @Get()
  findUsers() {
    return this.userService.findAll();
  }
}
