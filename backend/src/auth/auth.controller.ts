import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { PublicPermission } from './decorator/public-permission.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserJwtPayload } from './types';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicPermission()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  user(@Request() body: Express.Request & { user: User }) {
    return this.authService.login(body.user);
  }

  @Get('/me')
  getProfile(@CurrentUser() user: UserJwtPayload) {
    return user;
  }
}
