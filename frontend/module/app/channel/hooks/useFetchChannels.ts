import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";

import { Channel, ChannelDataResponse } from "@/common";
import { httpClient } from "@/common/httpClient";
import { RootState } from "@/common/store/store";
import {
  setChannels,
  setCurrentChannel,
  setDMChannels,
} from "@/common/store/channelSlice";

const reservedChannelId = ["browse-channels", "all-dms"];

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

  const fetchChannels = useCallback(
    (workspaceId: string) => {
      if (!user) return;
      return httpClient
        .get<any, Channel[]>(`/channels`, {
          params: { workspaceId },
        })
        .then((r) => setWorkspaceChannels(r));
    },
    [user]
  );

  const fetchCurrentChannel = useCallback(
    (channelId: string) => {
      if (!user || !channelId || reservedChannelId.includes(channelId)) return;
      httpClient
        .get<any, Channel>(`/channels`, {
          params: { channelId },
        })
        .then((r) => dispatch(setCurrentChannel(r)));
    },
    [dispatch, user]
  );

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
      if (!user || !currentWorkspaceId || !userId) return;
      httpClient
        .get<any, Channel[]>(`/channels/direct-message-channels`, {
          params: { userIds: userId },
        })
        .then((r) => dispatch(setDMChannels(r)));
    },
    [currentWorkspaceId, dispatch, user]
  );

  return {
    workspaceChannels,
    fetchChannels,
    fetchSubscribe,
    fetchCurrentChannel,
    fetchUnsubscribe,
    fetchSubscribedChannels,
    findOneDMChannel,
    fetchManyDMChannels,
    directMessageChannels,
  };
};
