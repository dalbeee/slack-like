import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import { Channel, ChannelDataResponse } from "@/common";
import { httpClient } from "@/common/httpClient";
import { RootState } from "@/common/store/store";
import {
  appendChannel,
  deleteChannel,
  setChannels,
} from "@/common/store/channelSlice";

export const useFetchChannels = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const fetchSubscribedChannels = useCallback(() => {
    if (!user) return;
    httpClient
      .get<any, ChannelDataResponse>(`/users/subscribed-channels`, {
        params: { workspaceId: router.query?.workspace as string },
      })
      .then((r) => dispatch(setChannels(r)));
  }, [dispatch, router.query?.workspace, user]);

  const fetchSubscribe = useCallback(
    (channelId: string) => {
      if (!user) return;
      httpClient
        .post<any, Channel>(`/channels/subscribe?channelId=${channelId}`)
        .then((result) => dispatch(appendChannel(result)));
    },
    [dispatch, user]
  );

  const fetchUnsubscribe = useCallback(
    (channelId: string) => {
      if (!user) return;
      httpClient
        .post<any, Channel>(`/channels/unsubscribe?channelId=${channelId}`)
        .then((result) => dispatch(deleteChannel(result)));
    },
    [dispatch, user]
  );

  return {
    fetchSubscribe,
    fetchUnsubscribe,
    fetchSubscribedChannels,
  };
};
