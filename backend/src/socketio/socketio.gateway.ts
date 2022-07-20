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
import { ChannelMetadataUpdateDto } from './dto/channel-metadata-update.dto';

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

  constructor(private readonly socketIoService: SocketIOService) {}

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
    const { channelData, messageData } = await this.socketIoService.saveMessage(
      user,
      body,
    );
    this.io.to(body.socketInfo.workspaceId).emit('message', messageData);
    this.io.to(body.socketInfo.workspaceId).emit('channel', channelData);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.delete')
  async deleteMessage(
    @MessageBody() body: MessageDeleteDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    const { messageData } = await this.socketIoService.deleteMessage(
      user,
      body,
    );
    this.io.to(body.socketInfo.workspaceId).emit('message', messageData);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('channelMetadata.update')
  async updateChannelMetadata(
    @WebsocketCurrentUser() user: UserJwtPayload,
    @MessageBody() body: ChannelMetadataUpdateDto,
  ) {
    this.socketIoService.increaseUnreadMessageCount({
      channelId: body.socketInfo.channelId,
      workspaceId: body.socketInfo.workspaceId,
      userId: user.id,
    });
  }
}
