import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { httpClient } from "@/common/httpClient";
import { socketConnect, socketFactory } from "@/common/wsClient";
import { ChannelData, SocketMessage, SocketReaction } from "@/common";
import SendCommander from "./SendCommander";
import Content from "./content/Content";
import {
  appendCurerntChannelData,
  deleteCurrentChannelData,
  resetCurrentChannelData,
  setCurrentChannelData,
  setReaction,
} from "@/store/appSlice";

const ContentColumn = () => {
  const [wsClient] = useState(() => socketFactory());
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return;
    const fetchData = () => {
      const workspace = router.query?.workspace as string;
      const channel = router.query?.channel as string;
      if (!channel) return;
      httpClient.get<any, ChannelData>(`${workspace}/${channel}`).then((r) => {
        dispatch(setCurrentChannelData(r));
        return;
      });
    };
    fetchData();

    return () => {
      dispatch(resetCurrentChannelData);
    };
  }, [
    dispatch,
    router.isReady,
    router.query?.channel,
    router.query?.workspace,
  ]);

  useEffect(() => {
    socketConnect(
      wsClient,
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
  }, [dispatch, router.query?.channel, router.query?.workspace, wsClient]);

  return (
    <div className="w-full flex flex-col p-4">
      <Content ws={wsClient} />
      {router.query?.channel && <SendCommander ws={wsClient} />}
    </div>
  );
};

export default ContentColumn;
