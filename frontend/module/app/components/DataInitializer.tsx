import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/common/store/store";
import { useWsChannelOutbound } from "../hooks/useWsChannelOutbound";
import { useSocketServiceManager } from "../hooks/useSocketServiceManager";
import { useFetchSubscribedChannels } from "../hooks/useFetchSubscribedChannels";
import { useFetchJoinedWorkspaces } from "../hooks/useFetchJoinedWorkspaces";

const DataInitializer = () => {
  useSocketServiceManager();
  const router = useRouter();
  const { initialize } = useSelector((state: RootState) => state.app);
  const { fetchJoinedWorkspaces } = useFetchJoinedWorkspaces();
  const { fetchSubscribedChannels } = useFetchSubscribedChannels();
  const { setZeroUnreadMessageCount } = useWsChannelOutbound();

  useEffect(() => {
    if (initialize) return;
    fetchJoinedWorkspaces().then(() => {
      setTimeout(() => {
        fetchSubscribedChannels();
      }, 100);
      return;
    });
  }, [fetchJoinedWorkspaces, fetchSubscribedChannels, initialize]);

  useEffect(() => {
    setZeroUnreadMessageCount({
      channelId: router.query.channel as string,
      workspaceId: router.query.workspace as string,
    });
  }, [router.query.channel, router.query.workspace]);

  useEffect(() => {
    if (!router.query.channel) return;
  }, [router.query.channel, router.query.workspace]);

  return <></>;
};

export default DataInitializer;
