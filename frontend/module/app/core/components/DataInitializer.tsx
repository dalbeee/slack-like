import { useRouter } from "next/router";
import { useEffect } from "react";

import { useFetchChannels } from "../../channel/hooks/useFetchChannels";
import { useFetchWorkspaces } from "../../workspace/hooks/useFetchWorkspaces";
import { useSocketServiceManager } from "../hooks/useSocketServiceManager";

const DataInitializer = () => {
  const router = useRouter();
  useSocketServiceManager();
  const { fetchWorkspace, fetchJoinedWorkspaces } = useFetchWorkspaces();
  const { fetchSubscribedChannels, fetchCurrentChannel } = useFetchChannels();

  useEffect(() => {
    fetchSubscribedChannels();
    fetchJoinedWorkspaces();
  }, [fetchJoinedWorkspaces, fetchSubscribedChannels]);

  useEffect(() => {
    if (!router.query.workspace) return;
    fetchWorkspace(router.query?.workspace as string);
  }, [fetchWorkspace, router.query.workspace]);

  useEffect(() => {
    if (!router.query.channel) return;
    fetchCurrentChannel(router.query?.channel as string);
  }, [fetchCurrentChannel, router.query.channel]);

  return <></>;
};

export default DataInitializer;
