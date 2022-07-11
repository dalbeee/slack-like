import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

import { UserService } from '@src/user/user.service';
import { jwtConstants } from '../config/constants';
import { UserJwtPayload } from '../types';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    if (!bearerToken) throw new UnauthorizedException();

    try {
      const decoded = verify(
        bearerToken,
        jwtConstants.secret,
      ) as UserJwtPayload;
      return new Promise((resolve, reject) => {
        return this.userService.findUserByEmail(decoded.email).then((user) => {
          if (user) {
            context.args[0].user = decoded;
            resolve(user);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      return false;
    }
  }
}
