import { INestApplication } from '@nestjs/common';
import { io, SocketOptions } from 'socket.io-client';

export const socketIoClientFactory = (
  app: INestApplication,
  options?: SocketOptions,
) => {
  const getPort = () => app.getHttpServer().listen().address().port;
  return io(`http://localhost:${getPort()}`, options || {});
};
