import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { HttpChannelMetadataResponse } from "@/common";
import { setChannelsMetadata } from "@/common/store/appSlice";
import { setZeroUnreadMessageCount } from "@/common/wsClient";

export const useWsSetZeroUnreadMessageCount = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const fetch = ({
    channelId,
    workspaceId,
  }: {
    workspaceId: string;
    channelId: string;
  }) => {
    setZeroUnreadMessageCount({
      socketInfo: {
        channelId,
        workspaceId,
      },
    });
    const channelMetadata: HttpChannelMetadataResponse = {
      [router.query.channel as string]: {
        unreadMessageCount: 0,
      },
    };
    dispatch(setChannelsMetadata(channelMetadata));
  };

  return { fetch };
};
