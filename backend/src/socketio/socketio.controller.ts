import { BadRequestException, UseGuards } from '@nestjs/common';
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
import { SocketIOMessage } from './types';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { SocketConnectionDto } from './dto/socket-connection.dto';

@WebSocketGateway({
  cors: { origin: Array.from((process.env.WS_CORS_URLS as string).split(',')) },
})
export class SocketIOController {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: SocketIOService) {}

  // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
    const message = await this.service.saveMessage(user, body);
    const data: SocketIOMessage = {
      socketInfo: body.socketInfo,
      channelTo: body.socketInfo.channelId,
      type: 'message',
      message,
    };
    this.server.to(body.socketInfo.workspaceId).emit('message.create', data);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.delete')
  async deleteMessage(
    @MessageBody() body: MessageDeleteDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    const result = await this.service.deleteMessage(user, body.messageId);
    if (!result) throw new BadRequestException();
    const data: SocketIOMessage = {
      socketInfo: body.socketInfo,
      channelTo: body.socketInfo.channelId,
      type: 'message',
      message: body.messageId,
    };
    this.server.to(body.socketInfo.workspaceId).emit('message.delete', data);
  }
}
