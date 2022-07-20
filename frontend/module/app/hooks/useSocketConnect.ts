import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { SocketChannelData, SocketMessageData } from "@/common";
import {
  appendCurerntChannelData,
  deleteCurrentChannelData,
  setReaction,
} from "@/common/store/appSlice";
import { socketConnect } from "@/common/wsClient";

export const useSocketConnect = () => {
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
          messageKey: "message",
          callbackFn: (data: SocketMessageData) => {
            switch (data.type) {
              case "message.create":
                dispatch(appendCurerntChannelData(data));
                break;
              case "message.delete":
                dispatch(deleteCurrentChannelData(data));
                break;
              default:
                return;
            }
          },
        },
        {
          messageKey: "channel",
          callbackFn: (data: SocketChannelData) => {
            switch (data.type) {
              case "channel":
                dispatch(setReaction(data));
                break;
              default:
                return;
            }
          },
        },
      ]
    );
  }, [dispatch, router.query?.channel, router.query?.workspace]);
};
