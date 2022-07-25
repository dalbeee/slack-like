import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { SocketIoGateway } from './socketio.gateway';

@Injectable()
export class SocketIoOutboundService {
  socket: SocketIoGateway;
  constructor(
    @Inject(forwardRef(() => SocketIoGateway))
    private readonly socketGateway: SocketIoGateway,
  ) {
    this.socket = socketGateway;
  }

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
