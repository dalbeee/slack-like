import { io } from "socket.io-client";

import { SocketIOInfo, SocketIOMessage } from "./types";

const url = process.env.NEXT_PUBLIC_WS_URL;

export const wsClient = io(url as string);

export const connect = (props: SocketIOInfo, fetcher: (arg: any) => any) => {
  wsClient.emit("connection", { socketInfo: props });
  init(fetcher);
};

export const send = ({
  channelId,
  workspaceId,
  userId,
  message,
}: {
  workspaceId: string;
  channelId?: string;
  userId?: string;
  message: string;
}) => {
  const data = {
    socketInfo: {
      channelId,
      workspaceId,
      userId,
    },
    message,
  };
  wsClient.emit("message", data);
};

const init = (callback: (arg: any) => any) =>
  wsClient.on("message", (res: SocketIOMessage) => {
    callback(res.message);
  });
