import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { Message } from "@/common";
import { appendMessage, deleteMessage } from "@/common/store/messageSlice";

export const useWsMessageInbound = () => {
  const dispatch = useDispatch();

  const messageCreateCallback = useMemo(
    () => ({
      messageKey: "message.create",
      callbackFn: (data: Message) => {
        dispatch(appendMessage(data));
      },
    }),
    [dispatch]
  );

  const messageDeleteCallback = useMemo(
    () => ({
      messageKey: "message.delete",
      callbackFn: (data: Message) => dispatch(deleteMessage(data)),
    }),
    [dispatch]
  );

  const messageInboundFns = [messageCreateCallback, messageDeleteCallback];

  return { messageCreateCallback, messageDeleteCallback, messageInboundFns };
};
