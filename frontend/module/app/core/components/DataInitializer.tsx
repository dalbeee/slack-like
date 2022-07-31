import { Message } from "@/common";
import { setCurrentThreadId, setThread } from "@/common/store/threadSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useFetchChannels } from "../../channel/hooks/useFetchChannels";
import { useFetchMessages } from "../../message/hooks/useFetchMessages";
import { useFetchWorkspaces } from "../../workspace/hooks/useFetchWorkspaces";
import { useSocketServiceManager } from "../hooks/useSocketServiceManager";

const DataInitializer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useSocketServiceManager();
  const { fetchWorkspace, fetchJoinedWorkspaces } = useFetchWorkspaces();
  const { fetchSubscribedChannels, fetchCurrentChannel } = useFetchChannels();
  const { fetchThread } = useFetchMessages();

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

  useEffect(() => {
    dispatch(setCurrentThreadId((router.query?.thread as string) ?? ""));
    if (router.query?.thread) fetchThread();
    else dispatch(setThread({} as Message));
  }, [dispatch, fetchThread, router.query?.thread]);

  return <></>;
};

export default DataInitializer;
