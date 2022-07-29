import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
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
import { ChannelCreateDto } from '@src/channel/dto/channel-create.dto';
import { SocketIoChannelInboundService } from './socketio-channel-inbound.service';
import { ChannelSubscribeDto } from '@src/channel/dto/channel-subscribe.dto';
import { verify } from 'jsonwebtoken';
import { jwtConstants } from '../auth/config/constants';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketIoGateway implements OnGatewayConnection {
  @WebSocketServer()
  io: Server;

  constructor(
    @Inject(forwardRef(() => SocketIoInboudService))
    private readonly socketIoService: SocketIoInboudService,
    @Inject(forwardRef(() => SocketIoChannelInboundService))
    private readonly socketIoChannelInboundService: SocketIoChannelInboundService,
    private readonly userRedisService: UserRedisService,
  ) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;
    if (!token) return socket.disconnect();

    try {
      const user = verify(token, jwtConstants.secret) as UserJwtPayload;
      await this._saveSocketId({
        userId: user.id,
        socketId: socket.id,
      });
      return;
    } catch (ex) {
      throw new WsException('token required');
    }
  }

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
    return this.userRedisService.findSocketsByUserId(userId);
  }

  _removeSocketIdFromUser(userId: string, socketId: string) {
    return this.userRedisService.removeSocketAt(userId, socketId);
  }

  // inbound methods

  @UseGuards(WsGuard)
  @SubscribeMessage('message.create')
  broadcastToWorkspace(
    @MessageBody() body: MessageCreateDto,
    @WebsocketCurrentUser() user: UserJwtPayload,
  ) {
    console.log('message.create event');
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
  @SubscribeMessage('channel.create')
  createChannel(
    @WebsocketCurrentUser() user: UserJwtPayload,
    @MessageBody() data: ChannelCreateDto,
  ) {
    return this.socketIoChannelInboundService.createChannel(user.id, data);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('channel.subscribe')
  subscribeChannel(
    @WebsocketCurrentUser() user: UserJwtPayload,
    @MessageBody() data: ChannelSubscribeDto,
  ) {
    return this.socketIoChannelInboundService.subscribeChannel(
      user.id,
      data.channelId,
    );
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('channel.unsubscribe')
  unsubscribeChannel(
    @WebsocketCurrentUser() user: UserJwtPayload,
    @MessageBody() data: ChannelSubscribeDto,
  ) {
    return this.socketIoChannelInboundService.unsubscribeChannel(
      user.id,
      data.channelId,
    );
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
