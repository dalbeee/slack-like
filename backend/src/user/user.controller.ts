import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserService } from '@src/user/user.service';
import { UserCreateDto } from '@src/user/dto/user-create.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: UserCreateDto) {
    return this.userService.createUser(user);
  }

  // @Get('/:id')
  // findUserById() {}

  // @Get()
  // findUsers() {}
}
