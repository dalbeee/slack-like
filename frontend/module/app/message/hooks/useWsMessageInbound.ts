import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { SocketMessageCreate, SocketMessageDelete } from "@/common";
import { appendMessage, deleteMessage } from "@/common/store/messageSlice";

export const useWsMessageInbound = () => {
  const dispatch = useDispatch();

  const messageCreateCallback = useMemo(
    () => ({
      messageKey: "message.create",
      callbackFn: (data: SocketMessageCreate) => {
        dispatch(appendMessage(data.data));
      },
    }),
    [dispatch]
  );

  const messageDeleteCallback = useMemo(
    () => ({
      messageKey: "message.delete",
      callbackFn: (data: SocketMessageDelete) =>
        dispatch(deleteMessage(data.messageId)),
    }),
    [dispatch]
  );

  const messageInboundFns = [messageCreateCallback, messageDeleteCallback];

  return { messageCreateCallback, messageDeleteCallback, messageInboundFns };
};
