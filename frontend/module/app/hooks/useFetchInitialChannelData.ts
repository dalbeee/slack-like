import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { httpClient } from "@/common/httpClient";
import { setCurrentChannelData } from "@/common/store/appSlice";
import { ChannelData } from "@/common";

export const useFetchInitialChannelData = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const workspace = router.query?.workspace as string;
    const channel = router.query?.channel as string;
    if (!workspace || !channel) return;
    httpClient
      .get<any, ChannelData>(`/channels?channelId=${channel}`)
      .then((r) => {
        dispatch(setCurrentChannelData(r));
        return;
      });
  }, [dispatch, router.query?.channel, router.query?.workspace]);
  return;
};
