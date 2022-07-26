import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { SocketInfo, SocketMessageCreate, SocketMessageDelete } from "@/common";
import {
  appendChannelMetadata,
  appendCurerntChannelData,
  deleteCurrentChannelData,
} from "@/common/store/appSlice";
import { socketConnect } from "@/common/wsClient";

export const useSocketServiceManager = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    socketConnect(
      {
        workspaceId: router.query?.workspace as string,
        channelId: router.query?.channel as string,
      },
      [
        {
          messageKey: "message.create",
          callbackFn: (data: SocketMessageCreate) => {
            const socketInfo: SocketInfo = {
              workspaceId: data.data.workspaceId,
              channelId: data.data.channelId,
            };
            dispatch(appendCurerntChannelData(data.data));
            dispatch(
              appendChannelMetadata({
                metadata: data.metadata,
                socketInfo: socketInfo,
              })
            );
          },
        },
        {
          messageKey: "message.delete",
          callbackFn: (data: SocketMessageDelete) =>
            dispatch(deleteCurrentChannelData(data.messageId)),
        },
      ]
    );
  }, [dispatch, router.query?.channel, router.query?.workspace]);
};
