import { useDispatch } from "react-redux";

import { ChannelMetadata, SocketInfo } from "@/common";
import { socketFactory } from "@/common/wsClient";
import { useCallback } from "react";
import { appendChannelMetadata } from "@/common/store/appSlice";

export const useWsChannelOutbound = () => {
  const dispatch = useDispatch();
  const ws = socketFactory();

  const setZeroUnreadMessageCount = useCallback(
    (data: SocketInfo) => {
      // eslint-disable-next-line security/detect-object-injection
      if (!data.channelId || !data.workspaceId) return;
      ws.emit("channel.setZeroUnreadMessageCount", { socketInfo: data });
      const channelMetadata: {
        socketInfo: SocketInfo;
        metadata: ChannelMetadata;
      } = {
        socketInfo: data,
        metadata: {
          unreadMessageCount: 0,
        },
      };
      dispatch(appendChannelMetadata(channelMetadata));
    },
    [dispatch, ws]
  );

  return { setZeroUnreadMessageCount };
};
