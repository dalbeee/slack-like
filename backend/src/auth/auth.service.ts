import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { UserService } from '@src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && user.password === pass) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User) {
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    const accessTokenPayload = user;
    const refreshTokenPayload = { key: user.id };
    return {
      access_token: this.jwtService.sign(accessTokenPayload),
      refresh_token: this.jwtService.sign(refreshTokenPayload),
    };
  }
}
