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
    (message: string) => {
      if (!socketInfo) return;
      ws.emit("message.create", { socketInfo, message });
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

  return { createMessage, deleteMessage };
};
