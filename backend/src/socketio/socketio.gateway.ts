import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketCurrentUser } from '@src/auth/decorator/current-user-websocket.decorator';
import { WsGuard } from '@src/auth/guard/websocket.guard';
import { UserJwtPayload } from '@src/auth/types';
import { MessageCreateDto } from './dto/message-create.dto';
import { SocketIOService } from './socketio.service';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { SocketConnectionDto } from './dto/socket-connection.dto';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3001' },
})
export class SocketIOGateway {
  @WebSocketServer()
  io: Server;

  constructor(private readonly ioService: SocketIOService) {}

  @SubscribeMessage('connection')
  joinClient(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: SocketConnectionDto,
  ) {
    if (Object.keys(data).length === 0) return;
    socket.join(data.workspaceId);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.create')
  async broadcastToWorkspace(
    @MessageBody() body: MessageCreateDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    const { response, reaction } = await this.ioService.saveMessage(user, body);
    this.io.to(body.socketInfo.workspaceId).emit('message.create', response);
    this.io.to(body.socketInfo.workspaceId).emit('reaction', reaction);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.delete')
  async deleteMessage(
    @MessageBody() body: MessageDeleteDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    const { reaction, response } = await this.ioService.deleteMessage(
      user,
      body,
    );
    this.io.to(body.socketInfo.workspaceId).emit('message.delete', response);
    this.io.to(body.socketInfo.workspaceId).emit('reaction', reaction);
  }

  send(message: string) {
    this.io.emit('message.create', message);
  }
}
