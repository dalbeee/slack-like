import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserService } from '@src/user/user.service';
import { UserCreateDto } from '@src/user/dto/user-create.dto';
import { PublicPermission } from '@src/auth/decorator/public-permission.decorator';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicPermission()
  @Post()
  createUser(@Body() user: UserCreateDto) {
    return this.userService.createUser(user);
  }

  @Get()
  findUsers() {
    return this.userService.findAll();
  }
}
