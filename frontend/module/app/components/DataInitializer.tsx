import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/common/store/store";
import { useFetchChannelMetadata } from "../hooks/useFetchChannelMetadata";
import { useFetchChannels } from "../hooks/useFetchChannels";
import { useWsSetZeroUnreadMessageCount } from "../hooks/useWsSetZeroUnreadMessageCount";
import { useSocketServiceManager } from "../hooks/useSocketServiceManager";

const DataInitializer = () => {
  useSocketServiceManager();
  const router = useRouter();
  const dispatch = useDispatch();
  const { initialize } = useSelector((state: RootState) => state.app);
  const { fetch: fetchChannelMetadata } = useFetchChannelMetadata();
  const { fetch: fetchChannels } = useFetchChannels();
  const { fetch: setZeroUnreadMessageCount } = useWsSetZeroUnreadMessageCount();

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
    setZeroUnreadMessageCount();
  }, [router.query.channel, router.query.workspace, setZeroUnreadMessageCount]);

  useEffect(() => {
    if (!router.query.channel) return;
  }, [router.query.channel, router.query.workspace]);

  return <></>;
};

export default DataInitializer;
