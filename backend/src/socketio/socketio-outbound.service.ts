import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRedisService } from '@src/user/user-redis.service';

import { SocketIoGateway } from './socketio.gateway';

@Injectable()
export class SocketIoOutboundService {
  constructor(
    @Inject(forwardRef(() => SocketIoGateway))
    private readonly socketGateway: SocketIoGateway,
    private readonly userRedisService: UserRedisService,
  ) {}

  async sendToClient(
    { messageKey, socketId }: { messageKey: string; socketId: string },
    data: any,
  ) {
    this.socketGateway.sendToClientBySocketId({ messageKey, socketId }, data); 
    return;
  }

  async sendToUser(userId: string, messageKey: string, data: any) {
    const sockets = await this.userRedisService.findSocketsByUserId(userId);
    sockets.forEach((socketId) => {
      this.sendToClient({ messageKey, socketId }, data);
    });
  }
}
