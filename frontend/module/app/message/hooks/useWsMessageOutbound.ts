import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { socketFactory } from "@/common/wsClient";
import { SocketInfo } from "@/common";

export const useWsMessageOutbound = () => {
  const ws = socketFactory();
  const router = useRouter();

  const [socketInfo, setSocketInfo] = useState<null | SocketInfo>(null);

  useEffect(() => {
    setSocketInfo({
      workspaceId: router.query?.workspace as string,
      channelId: router.query?.channel as string,
    });
  }, [router.query?.channel, router.query?.workspace]);

  const createMessage = useCallback(
    (content: string) => {
      if (!socketInfo) return;
      ws.emit("message.create", { socketInfo, content });
    },
    [socketInfo, ws]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!socketInfo) return;
      ws.emit("message.delete", { socketInfo, messageId });
    },
    [socketInfo, ws]
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
