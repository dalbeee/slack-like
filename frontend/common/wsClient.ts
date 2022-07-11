import { io } from "socket.io-client";

import { SocketIOInfo } from "./types";

const url = process.env.NEXT_PUBLIC_WS_URL;

export const wsClient = io(url as string);

export const connect = (props: SocketIOInfo) => {
  wsClient.emit("connection", { socketInfo: props });
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

wsClient.on("message", (res) => {
  console.log(res);
});
