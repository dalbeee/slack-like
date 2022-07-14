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

type CallbackProps = {
  messageKey: string;
  callbackFn: (arg: any) => any;
};

const init = (ws: Socket, setupCallbacks: CallbackProps[]) => {
  setupCallbacks.forEach((callback) => {
    ws.off(callback.messageKey);
    ws.on(callback.messageKey, (res: SocketIOMessage) => {
      callback.callbackFn(res.message);
    });
  });
};

export const wsClientFactory = () => io(url as string, socketOptions());

export const socketConnect = (
  ws: Socket,
  socketInfo: SocketIOInfo,
  callbacks: CallbackProps[]
) => {
  if (!ws) return;
  ws.emit("connection", socketInfo);
  init(ws, callbacks);
};

export const createMessage = (
  ws: Socket,
  data: {
    socketInfo: { workspaceId: string; channelId: string };
    message: string;
  }
) => {
  ws.emit("message.create", data);
};

export const deleteMessage = (
  ws: Socket,
  data: {
    socketInfo: { channelId: string; workspaceId: string };
    messageId: string;
  }
) => {
  ws.emit("message.delete", data);
};
