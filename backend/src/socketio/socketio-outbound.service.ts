import { Injectable } from '@nestjs/common';

import { SocketIoGateway } from './socketio.gateway';

@Injectable()
export class SocketIoOutboundService {
  constructor(private readonly socketGateway: SocketIoGateway) {}

  async sendToClient(
    { messageKey, socketId }: { messageKey: string; socketId: string },
    data: any,
  ) {
    return this.socketGateway.sendToClientBySocketId(
      { messageKey, socketId },
      data,
    );
  }
}
