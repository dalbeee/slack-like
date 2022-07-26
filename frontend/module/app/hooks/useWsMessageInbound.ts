import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { SocketInfo, SocketMessageCreate, SocketMessageDelete } from "@/common";
import {
  appendChannelMetadata,
  appendCurerntChannelData,
  deleteCurrentChannelData,
} from "@/common/store/appSlice";

export const useWsMessageInbound = () => {
  const dispatch = useDispatch();

  const messageCreateCallback = useMemo(
    () => ({
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
    }),
    [dispatch]
  );

  const messageDeleteCallback = useMemo(
    () => ({
      messageKey: "message.delete",
      callbackFn: (data: SocketMessageDelete) =>
        dispatch(deleteCurrentChannelData(data.messageId)),
    }),
    [dispatch]
  );

  return { messageCreateCallback, messageDeleteCallback };
};
