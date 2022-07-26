import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { HttpChannelMetadataResponse, SocketInfo } from "@/common";
import { setChannelsMetadata } from "@/common/store/appSlice";
import { socketFactory } from "@/common/wsClient";
import { useCallback } from "react";

export const useWsChannelOutbound = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = socketFactory();

  const setZeroUnreadMessageCount = useCallback(
    (data: SocketInfo) => {
      ws.emit("channel.setZeroUnreadMessageCount", data);

      const channelMetadata: HttpChannelMetadataResponse = {
        [router.query.channel as string]: {
          unreadMessageCount: 0,
        },
      };
      dispatch(setChannelsMetadata(channelMetadata));
    },
    [dispatch, ws]
  );

  return { setZeroUnreadMessageCount };
};
