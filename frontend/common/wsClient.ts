import { io, Socket } from "socket.io-client";

import { SocketInfo } from ".";
import { tokenVault } from "./httpClient";

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
    ws.on(callback.messageKey, (res) => {
      callback.callbackFn(res);
    });
  });
};

const socketFactory = () => io(url as string, socketOptions());

const socketConnect = (
  ws: Socket,
  socketInfo: SocketInfo,
  callbacks: CallbackProps[]
) => {
  if (!ws) return;
  ws.emit("connection", socketInfo);
  init(ws, callbacks);
};

const createMessage = (
  ws: Socket,
  data: {
    socketInfo: { workspaceId: string; channelId: string };
    message: string;
  }
) => {
  ws.emit("message.create", data);
};

const deleteMessage = (
  ws: Socket,
  data: {
    socketInfo: { channelId: string; workspaceId: string };
    messageId: string;
  }
) => {
  ws.emit("message.delete", data);
};

export { socketFactory, socketConnect, createMessage, deleteMessage };
