import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { socketFactory } from "@/common/wsClient";
import { EventOutboundTarget, SocketInfo } from "@/common";
import { RootState } from "@/common/store/store";

export const useWsMessageOutbound = () => {
  const ws = socketFactory();
  const router = useRouter();
  const { thread } = useSelector((state: RootState) => state.thread);

  const [socketInfo, setSocketInfo] = useState<null | SocketInfo>(null);

  useEffect(() => {
    setSocketInfo({
      workspaceId: router.query?.workspace as string,
      channelId: router.query?.channel as string,
    });
  }, [router.query?.channel, router.query?.workspace]);

  const querySelector = useCallback(
    (eventOutboundTarget: EventOutboundTarget) => {
      return eventOutboundTarget === "THREAD" ? { ancestorId: thread.id } : {};
    },
    [thread.id]
  );

  const createMessage = useCallback(
    ({
      content,
      eventOutboundTarget,
    }: {
      content: string;
      eventOutboundTarget: EventOutboundTarget;
    }) => {
      if (!socketInfo) return;

      ws.emit("message.create", {
        socketInfo,
        content,
        ...querySelector(eventOutboundTarget),
      });
    },
    [querySelector, socketInfo, ws]
  );

  const deleteMessage = useCallback(
    ({
      messageId,
      eventOutboundTarget,
    }: {
      messageId: string;
      eventOutboundTarget: EventOutboundTarget;
    }) => {
      if (!socketInfo) return;

      ws.emit("message.delete", {
        socketInfo,
        messageId,
        ...querySelector(eventOutboundTarget),
      });
    },
    [querySelector, socketInfo, ws]
  );

  const createReaction = useCallback(
    (dto: { content: string; messageId: string }) => {
      if (!socketInfo) return;
      ws.emit("message_reaction.create", { socketInfo, ...dto });
    },
    [socketInfo, ws]
  );

  const deleteReaction = useCallback(
    (dto: { reactionId: string }) => {
      if (!socketInfo) return;
      ws.emit("message_reaction.delete", { socketInfo, ...dto });
    },
    [socketInfo, ws]
  );

  return { createMessage, deleteMessage, createReaction, deleteReaction };
};
