import { useRouter } from "next/router";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChannelData } from "@/common";
import { httpClient } from "@/common/httpClient";
import { setMessages } from "@/common/store/messageSlice";
import { RootState } from "@/common/store/store";

export const useFetchMessages = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { messages } = useSelector((state: RootState) => state.messages);

  const fetchMessages = useCallback(() => {
    if (!user || !router.query?.channel) return;
    httpClient
      .get<any, ChannelData>(
        `/channels?channelId=${router.query?.channel as string}`
      )
      .then((r) => dispatch(setMessages(r.Messages)));
  }, [dispatch, router.query?.channel, user]);

  return { fetchMessages, messages };
};
