import { io, Socket } from "socket.io-client";

import { SocketInfo } from ".";
import { tokenVault } from "./httpClient";

const url = process.env.NEXT_PUBLIC_WS_URL;

const socketOptions = (token?: string) => ({
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: token
          ? `Bearer ${token}`
          : `Bearer ${tokenVault.getAccessToken()}`,
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
    ws.on(callback.messageKey, (res) => {
      callback.callbackFn(res);
    });
  });
};

export const socketFactory = (token?: string) => {
  let ws: Socket | null = null;

  if (!ws) {
    ws = io(url as string, socketOptions(token));
  }
  return ws;
};

export const socketConnect = (
  socketInfo: SocketInfo,
  callbacks: CallbackProps[]
) => {
  const ws = socketFactory();
  ws.emit("connection", socketInfo);
  init(ws, callbacks);
};

export const setZeroUnreadMessageCount = (data: { socketInfo: SocketInfo }) => {
  socketFactory().emit("channel.setZeroUnreadMessageCount", data);
};
