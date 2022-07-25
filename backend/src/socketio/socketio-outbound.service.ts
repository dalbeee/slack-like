import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { UserRedisService } from '@src/user/user-redis.service';
import { SocketIoGateway } from './socketio.gateway';

@Injectable()
export class SocketIoOutboundService {
  constructor(
    @Inject(forwardRef(() => SocketIoGateway))
    private readonly socketGateway: SocketIoGateway,
    @Inject(forwardRef(() => UserRedisService))
    private readonly userRedisService: UserRedisService,
  ) {}

  async sendToClient(data: { messageId: string; workspaceId: string }) {
    const socket = await this.userRedisService.findSocketByMessageAuthor(
      data.messageId,
    );
    if (!socket) return;
    // return this.socketGateway.sendToClient(socket);
  }
}
