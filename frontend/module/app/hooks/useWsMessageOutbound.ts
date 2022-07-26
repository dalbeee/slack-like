import { SocketInfo } from "@/common";
import { socketFactory } from "@/common/wsClient";

export const useWsMessageOutbound = () => {
  const ws = socketFactory();

  const createMessage = (data: { socketInfo: SocketInfo; message: string }) => {
    ws.emit("message.create", data);
  };

  const deleteMessage = (data: {
    socketInfo: SocketInfo;
    messageId: string;
  }) => {
    ws.emit("message.delete", data);
  };

  return { createMessage, deleteMessage };
};
