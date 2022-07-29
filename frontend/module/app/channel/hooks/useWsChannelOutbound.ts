import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { SocketInfo, UpdateChannelMetadata } from "@/common";
import { socketFactory } from "@/common/wsClient";
import { updateChannelMetadata } from "@/common/store/channelSlice";

export const useWsChannelOutbound = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = socketFactory();
  const [socketInfo, setSocketInfo] = useState<null | SocketInfo>(null);

  useEffect(() => {
    setSocketInfo({
      workspaceId: router.query?.workspace as string,
      channelId: router.query?.channel as string,
    });
  }, [router.query?.channel, router.query?.workspace]);

  // TODO
  const createChannel = () => {
    ws.emit("channel.create", {});
  };

  const setZeroUnreadMessageCount = useCallback(() => {
    if (!socketInfo) return;
    ws.emit("channel.setZeroUnreadMessageCount", { socketInfo });
    const channelMetadata: UpdateChannelMetadata = {
      socketInfo,
      metadata: {
        unreadMessageCount: 0,
      },
    };
    dispatch(updateChannelMetadata(channelMetadata));
  }, [dispatch, socketInfo, ws]);

  return { createChannel, setZeroUnreadMessageCount };
};
