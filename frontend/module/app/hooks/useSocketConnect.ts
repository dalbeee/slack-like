import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { SocketMessage, SocketReaction } from "@/common";
import {
  appendCurerntChannelData,
  deleteCurrentChannelData,
  setReaction,
} from "@/common/store/appSlice";
import { socketConnect, socketFactory } from "@/common/wsClient";

export const useSocketConnect = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ws = socketFactory();

  useEffect(() => {
    if (!ws) return;
    socketConnect(
      ws,
      {
        workspaceId: router.query?.workspace as string,
        channelId: router.query?.channel as string,
      },
      [
        {
          messageKey: "message.create",
          callbackFn: (data: SocketMessage) =>
            dispatch(appendCurerntChannelData(data)),
        },
        {
          messageKey: "message.delete",
          callbackFn: (data: SocketMessage) =>
            dispatch(deleteCurrentChannelData(data)),
        },
        {
          messageKey: "reaction",
          callbackFn: (data: SocketReaction) => dispatch(setReaction(data)),
        },
      ]
    );
  }, [dispatch, router.query?.channel, router.query?.workspace, ws]);
};
