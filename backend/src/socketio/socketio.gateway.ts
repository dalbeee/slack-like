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
import { SocketInfo } from '.';

type SocketManager = {
  userId: string;
  socketId: string;
  workspaceId: string;
};

@WebSocketGateway({
  cors: { origin: 'http://localhost:3001' },
})
export class SocketIOGateway {
  @WebSocketServer()
  io: Server;
  socketManager: SocketManager[] = [] as SocketManager[];

  constructor(private readonly ioService: SocketIOService) {}

  _findSocketIdFromUserId(userId: string) {
    return this.socketManager.find(({ userId: id }) => id === userId);
  }

  _saveSocketId(data: {
    userId: string;
    socketId: string;
    workspaceId: string;
  }) {
    this.socketManager.push(data);
  }
  /////////

  ///////// public method
  send(
    socketInfo: SocketInfo,
    { data, keyword, sendTo }: { keyword: string; sendTo: string; data: any },
  ) {
    this.io.to(sendTo).emit(keyword, {
      socketInfo,
      data,
    });
  }

  sendReactionToUser(userId: string, data: any) {
    const user = this._findSocketIdFromUserId(userId);
    if (!user) return;
    this.io.to(user.socketId).emit('reaction', { data });
    // this.send(user.socketId, data);
  }

  ///////

  ///////// gateway method
  @UseGuards(WsGuard)
  @SubscribeMessage('connection')
  joinClient(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: SocketConnectionDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    if (Object.keys(data).length === 0) return;
    socket.join(data.workspaceId);
    this._saveSocketId({
      socketId: socket.id,
      userId: user.id,
      workspaceId: data.workspaceId,
    });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.create')
  async broadcastToWorkspace(
    @MessageBody() body: MessageCreateDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    const { response, reaction } = await this.ioService.saveMessage(user, body);
    this.io.to(body.socketInfo.workspaceId).emit('message', response);
    this.io.to(body.socketInfo.workspaceId).emit('reaction', reaction);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.delete')
  async deleteMessage(
    @MessageBody() body: MessageDeleteDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    const { response } = await this.ioService.deleteMessage(user, body);
    this.io.to(body.socketInfo.workspaceId).emit('message', response);
  }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('reaction')
  // async createReaction(
  //   @WebsocketCurrentUser() user: UserJwtPayload,
  //   @MessageBody() body: unknown,
  // ) {
  //   const { socketId } = this._findSocketIdFromUserId(user.id);
  //   this.ioService.findMessageAuthor((body as any).messageId);
  // }
}
