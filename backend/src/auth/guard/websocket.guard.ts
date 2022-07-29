import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { UserService } from '@src/user/user.service';
import { jwtConstants } from '../config/constants';
import { UserJwtPayload } from '../types';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const socket = context.switchToWs().getClient() as Socket;
    const handshake = socket.handshake;
    const bearerToken = handshake.auth.token;
    if (!bearerToken) throw new WsException(new Error('token required'));

    try {
      const decoded = verify(
        bearerToken,
        jwtConstants.secret,
      ) as UserJwtPayload;
      return new Promise((resolve, reject) => {
        return this.userService.findUserByEmail(decoded.email).then((user) => {
          if (user) {
            (socket as any).user = decoded;
            resolve(user);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      throw new WsException(new Error('token required'));
    }
  }
}
