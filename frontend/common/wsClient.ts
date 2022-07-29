import { io, Socket } from "socket.io-client";

import { tokenVault } from "./httpClient";

const url = process.env.NEXT_PUBLIC_WS_URL;

type CallbackProps = {
  messageKey: string;
  callbackFn: (arg: any) => any;
};

const socket = io(url as string, {
  auth: { token: tokenVault.getAccessToken() },
});

export const socketFactory = () => {
  return socket;
};

export const socketEventConnector = (
  ws: Socket,
  callbacks: CallbackProps[]
) => {
  callbacks.forEach((callback) => {
    ws.off(callback.messageKey);
    ws.on(callback.messageKey, (res) => {
      callback.callbackFn(res);
    });
  });
  return ws;
};

export const socketEventDisconnector = (ws: Socket) => {
  ws.offAny();
};

export const socketDisconnect = (ws: Socket) => {
  ws.disconnect();
};
