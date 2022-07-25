import { io, SocketOptions } from 'socket.io-client';

export const socketIoClientFactory = async (
  port: number,
  options?: SocketOptions,
) => {
  return io(`http://localhost:${port}`, options || {});
};
