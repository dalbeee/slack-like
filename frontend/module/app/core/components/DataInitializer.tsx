import { useRouter } from "next/router";
import { useEffect } from "react";

import { useFetchChannels } from "../../channel/hooks/useFetchChannels";
import { useFetchWorkspaces } from "../../workspace/hooks/useFetchWorkspaces";
import { useSocketServiceManager } from "../hooks/useSocketServiceManager";

const DataInitializer = () => {
  const router = useRouter();
  useSocketServiceManager();
  const { fetchWorkspace, fetchJoinedWorkspaces } = useFetchWorkspaces();
  const { fetchSubscribedChannels } = useFetchChannels();

  useEffect(() => {
    fetchSubscribedChannels();
    fetchJoinedWorkspaces();
  }, [fetchJoinedWorkspaces, fetchSubscribedChannels]);

  useEffect(() => {
    if (!router.query.workspace) return;
    fetchWorkspace(router.query?.workspace as string);
  }, [fetchWorkspace, router.query.workspace]);

  return <></>;
};

export default DataInitializer;
