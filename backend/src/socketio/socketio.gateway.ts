import { forwardRef, Inject, UseGuards } from '@nestjs/common';
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
import { SocketIoInboudService } from './socketio-inbound.service';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { ChannelMetadataUpdateDto } from './dto/channel-metadata-update.dto';
import { UserRedisService } from '@src/user/user-redis.service';
import { SocketConnectionDto } from './dto/socket-connection.dto';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3001' },
})
export class SocketIoGateway {
  @WebSocketServer()
  io: Server;

  constructor(
    @Inject(forwardRef(() => SocketIoInboudService))
    private readonly socketIoService: SocketIoInboudService,
    private readonly userRedisService: UserRedisService,
  ) {}

  // outbound methods

  sendToClientBySocketId(
    { messageKey, socketId }: { socketId: string; messageKey: string },
    data: any,
  ) {
    return this.io.to(socketId).emit(messageKey, data);
  }

  broadcastToClients(messageKey: string, data: any) {
    return this.io.emit(messageKey, data);
  }

  // connection methods

  _saveSocketId({ socketId, userId }: { userId: string; socketId: string }) {
    return this.userRedisService.setSocketAt(userId, socketId);
  }

  _findSocketIdFromUserId(userId: string) {
    return this.userRedisService.findSocketByUserId(userId);
  }

  _removeSocketIdFromUser(userId: string, socketId: string) {
    return this.userRedisService.removeSocketAt(userId, socketId);
  }

  // inbound methods

  // TODO implement authenticate, if unauthorized, disconnect forcely
  // TODO new socket join specific workspace
  @UseGuards(WsGuard)
  @SubscribeMessage('connection')
  async joinClient(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: SocketConnectionDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    if (!Object.keys(data).length) return;

    await this._saveSocketId({
      userId: user.id,
      socketId: socket.id,
    });
    // TODO TEMP
    this.io.to(socket.id).emit('connection', 'valid');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.create')
  broadcastToWorkspace(
    @MessageBody() body: MessageCreateDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    return this.socketIoService.saveMessage(user, body);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.delete')
  async deleteMessage(
    @MessageBody() body: MessageDeleteDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    return await this.socketIoService.deleteMessage(user, body);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('channel.setZeroUnreadMessageCount')
  updateChannelMetadata(
    @WebsocketCurrentUser() user: UserJwtPayload,
    @MessageBody() body: ChannelMetadataUpdateDto,
  ) {
    this.socketIoService.setZeroUnreadMessageCount({
      channelId: body.socketInfo.channelId,
      workspaceId: body.socketInfo.workspaceId,
      userId: user.id,
    });
    return;
  }
}
