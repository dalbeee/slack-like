import { io, Socket } from "socket.io-client";
import { tokenVault } from "./httpClient";

import { SocketIOInfo, SocketIOMessage } from "./types";

const url = process.env.NEXT_PUBLIC_WS_URL;

const socketOptions = () => ({
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${tokenVault.getAccessToken()}`,
      },
    },
  },
});

const init = (ws: Socket, callback: (arg: any) => any) => {
  ws.off("message");
  ws.on("message", (res: SocketIOMessage) => {
    callback(res.message);
  });
};

export const wsClientFactory = () => io(url as string, socketOptions());

export const connect = (
  ws: Socket,
  props: SocketIOInfo,
  fetcher: (arg: any) => any
) => {
  if (!ws) return;
  ws.emit("connection", { socketInfo: props });
  init(ws, fetcher);
};

export const send = (
  ws: Socket,
  {
    channelId,
    workspaceId,
    message,
  }: {
    workspaceId: string;
    channelId?: string;
    message: string;
  }
) => {
  const data = {
    socketInfo: {
      channelId,
      workspaceId,
    },
    message,
  };
  ws.emit("message", data);
};
