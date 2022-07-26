import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/common/store/store";
import { useFetchChannelMetadata } from "../hooks/useFetchChannelMetadata";
import { useFetchChannels } from "../hooks/useFetchChannels";
import { useWsChannelOutbound } from "../hooks/useWsChannelOutbound";
import { useSocketServiceManager } from "../hooks/useSocketServiceManager";

const DataInitializer = () => {
  useSocketServiceManager();
  const router = useRouter();
  const dispatch = useDispatch();
  const { initialize } = useSelector((state: RootState) => state.app);
  const { fetchChannelMetadata } = useFetchChannelMetadata();
  const { fetchChannels } = useFetchChannels();
  const { setZeroUnreadMessageCount } = useWsChannelOutbound();

  useEffect(() => {
    if (!router.isReady || initialize) return;
    fetchChannelMetadata();
    fetchChannels();
  }, [
    dispatch,
    fetchChannelMetadata,
    fetchChannels,
    initialize,
    router.isReady,
    router.query.workspace,
  ]);

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
