import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";

import { Channel, ChannelDataResponse } from "@/common";
import { httpClient } from "@/common/httpClient";
import { RootState } from "@/common/store/store";
import { setChannels, setDMChannels } from "@/common/store/channelSlice";

export const useFetchChannels = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [workspaceChannels, setWorkspaceChannels] = useState<Channel[]>([]);
  const { currentWorkspaceId } = useSelector(
    (state: RootState) => state.workspaces
  );
  const { directMessageChannels } = useSelector(
    (state: RootState) => state.channels
  );

  const fetchChannels = useCallback((workspaceId: string) => {
    return httpClient
      .get<any, Channel[]>(`/channels`, {
        params: { workspaceId },
      })
      .then((r) => setWorkspaceChannels(r));
  }, []);

  const fetchSubscribedChannels = useCallback(() => {
    if (!user || !currentWorkspaceId) return;
    httpClient
      .get<any, ChannelDataResponse>(`/users/subscribed-channels`, {
        params: { workspaceId: currentWorkspaceId },
      })
      .then(async (r) => dispatch(setChannels(r)));
  }, [currentWorkspaceId, dispatch, user]);

  const fetchSubscribe = useCallback(
    (channelId: string) => {
      if (!user || !currentWorkspaceId) return;
      return httpClient
        .post<any, Channel>(`/channels/subscribe?channelId=${channelId}`)
        .then(() => fetchSubscribedChannels());
    },
    [currentWorkspaceId, fetchSubscribedChannels, user]
  );

  const fetchUnsubscribe = useCallback(
    (channelId: string) => {
      if (!user || !currentWorkspaceId) return;
      return httpClient
        .post<any, Channel>(`/channels/unsubscribe?channelId=${channelId}`)
        .then(() => fetchSubscribedChannels());
    },
    [currentWorkspaceId, fetchSubscribedChannels, user]
  );

  const findOneDMChannel = useCallback(
    ({ userIds, workspaceId }: { workspaceId: string; userIds: string[] }) => {
      if (!user || !currentWorkspaceId || !userIds || !workspaceId) return;
      return httpClient.get<any, Channel>(`/channels/direct-message-channel`, {
        params: {
          workspaceId,
          userIds,
        },
      });
    },
    [currentWorkspaceId, user]
  );

  const fetchManyDMChannels = useCallback(
    (userId: string) => {
      if (!currentWorkspaceId || !userId) return;
      httpClient
        .get<any, Channel[]>(`/channels/direct-message-channels`, {
          params: { userIds: userId },
        })
        .then((r) => dispatch(setDMChannels(r)));
    },
    [currentWorkspaceId, dispatch]
  );

  return {
    workspaceChannels,
    fetchChannels,
    fetchSubscribe,
    fetchUnsubscribe,
    fetchSubscribedChannels,
    findOneDMChannel,
    fetchManyDMChannels,
    directMessageChannels,
  };
};
