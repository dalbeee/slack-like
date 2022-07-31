import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { Message, MessageReaction } from "@/common";
import {
  appendMessage,
  appendMessageReaction,
  deleteMessage,
  deleteMessageReaction,
  updateMessageCommentsCount,
} from "@/common/store/messageSlice";
import { appendComment, deleteComment } from "@/common/store/threadSlice";

export const useWsMessageInbound = () => {
  const dispatch = useDispatch();

  const messageCreateCallback = useMemo(
    () => ({
      messageKey: "message.create",
      callbackFn: (data: Message) => {
        if (data.ancestorId) {
          dispatch(appendComment(data));
          dispatch(updateMessageCommentsCount(data));
        } else {
          dispatch(appendMessage(data));
        }
      },
    }),
    [dispatch]
  );

  const messageDeleteCallback = useMemo(
    () => ({
      messageKey: "message.delete",
      callbackFn: (data: Message) => {
        if (data.ancestorId) {
          dispatch(deleteComment(data));
          dispatch(updateMessageCommentsCount(data));
        } else {
          dispatch(deleteMessage(data));
        }
      },
    }),
    [dispatch]
  );

  const messageReactionCreateCallback = useMemo(
    () => ({
      messageKey: "message_reaction.create",
      callbackFn: (data: MessageReaction) => {
        dispatch(appendMessageReaction(data));
      },
    }),
    [dispatch]
  );

  const messageReactionDeleteCallback = useMemo(
    () => ({
      messageKey: "message_reaction.delete",
      callbackFn: (data: MessageReaction) =>
        dispatch(deleteMessageReaction(data)),
    }),
    [dispatch]
  );

  const messageInboundFns = [
    messageCreateCallback,
    messageDeleteCallback,
    messageReactionCreateCallback,
    messageReactionDeleteCallback,
  ];

  return {
    messageInboundFns,
  };
};
