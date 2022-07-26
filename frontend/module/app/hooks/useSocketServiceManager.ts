import { useRouter } from "next/router";
import { useEffect } from "react";

import { socketConnect } from "@/common/wsClient";
import { useWsMessageInbound } from "./useWsMessageInbound";

export const useSocketServiceManager = () => {
  const router = useRouter();
  const { messageCreateCallback, messageDeleteCallback } =
    useWsMessageInbound();

  useEffect(() => {
    socketConnect(
      {
        workspaceId: router.query?.workspace as string,
        channelId: router.query?.channel as string,
      },
      [messageCreateCallback, messageDeleteCallback]
    );
  }, [
    messageCreateCallback,
    messageDeleteCallback,
    router.query?.channel,
    router.query?.workspace,
  ]);
};
