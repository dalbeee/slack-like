import { useEffect } from "react";

import { useFetchChannels } from "../../channel/hooks/useFetchChannels";
import { useFetchWorkspaces } from "../../workspace/hooks/useFetchWorkspaces";
import { useSocketServiceManager } from "../hooks/useSocketServiceManager";

const DataInitializer = () => {
  useSocketServiceManager();
  const { fetchJoinedWorkspaces } = useFetchWorkspaces();
  const { fetchSubscribedChannels } = useFetchChannels();

  useEffect(() => {
    fetchJoinedWorkspaces().then(() => {
      setTimeout(() => {
        fetchSubscribedChannels();
      }, 100);
      return;
    });
  }, [fetchJoinedWorkspaces, fetchSubscribedChannels]);

  return <></>;
};

export default DataInitializer;
