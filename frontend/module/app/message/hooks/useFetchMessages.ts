import { useRouter } from "next/router";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChannelData, MessageReaction } from "@/common";
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
      .then((r) => dispatch(setMessages(r.messages)));
  }, [dispatch, router.query?.channel, user]);

  const postMessageReaction = useCallback(
    (dto: { messageId: string; userId: string; content: string }) => {
      if (!user) return;
      return httpClient.post<any, MessageReaction>(`/messages/reactions`, dto);
    },
    [user]
  );

  return { fetchMessages, messages, postMessageReaction };
};
