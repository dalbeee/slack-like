import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageDto } from './dto/message.dto';
import { SocketIOService } from './socketio.service';
import { SocketIOMessage } from './types';

@WebSocketGateway({
  cors: { origin: Array.from((process.env.WS_CORS_URLS as string).split(',')) },
})
export class SocketIOController {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: SocketIOService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @SubscribeMessage('connection')
  joinClient(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: Omit<MessageDto, 'data'>,
  ) {
    socket.join(data.socketInfo.workspaceId);
  }

  @SubscribeMessage('message')
  async broadcastToWorkspace(@MessageBody() body: MessageDto) {
    const message = await this.service.saveMessage(body);
    const data: SocketIOMessage = {
      socketInfo: {
        channelId: body.socketInfo.channelId,
        workspaceId: body.socketInfo.workspaceId,
        userId: undefined,
      },
      channelTo: body.socketInfo.channelId,
      type: 'message',
      message,
    };
    this.server.to(body.socketInfo.workspaceId).emit('message', data);
  }
}