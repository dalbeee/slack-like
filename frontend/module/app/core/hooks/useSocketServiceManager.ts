import { useRouter } from "next/router";
import { useEffect } from "react";

import {
  socketEventConnector,
  socketEventDisconnector,
  socketFactory,
} from "@/common/wsClient";
import { useWsMessageInbound } from "../../message/hooks/useWsMessageInbound";
import { setCurrentWorkspace } from "@/common/store/workspaceSlice";

export const useSocketServiceManager = () => {
  const router = useRouter();

  const { messageInboundFns } = useWsMessageInbound();

  useEffect(() => {
    const socket = socketFactory();
    setCurrentWorkspace(router.query?.workspace as string);
    socketEventConnector(socket, [...messageInboundFns]);

    return () => {
      socketEventDisconnector(socket);
    };
  }, [messageInboundFns, router.query?.workspace]);
};
