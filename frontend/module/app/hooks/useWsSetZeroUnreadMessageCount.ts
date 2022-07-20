import { HttpChannelMetadataResponse } from "@/common";
import { setChannelsMetadata } from "@/common/store/appSlice";
import { setZeroUnreadMessageCount } from "@/common/wsClient";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const useWsSetZeroUnreadMessageCount = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const fetch = useCallback(() => {
    setZeroUnreadMessageCount({
      socketInfo: {
        channelId: router.query.channel as string,
        workspaceId: router.query.workspace as string,
      },
    });
    const channelMetadata: HttpChannelMetadataResponse = {
      [router.query.channel as string]: {
        unreadMessageCount: 0,
      },
    };
    dispatch(setChannelsMetadata(channelMetadata));
  }, [dispatch, router.query.channel, router.query.workspace]);

  return { fetch };
};
