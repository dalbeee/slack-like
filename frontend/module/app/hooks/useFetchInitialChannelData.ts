import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { ChannelData } from "@/common";
import { httpClient } from "@/common/httpClient";
import { setCurrentChannelData } from "@/common/store/appSlice";

export const useFetchInitialChannelData = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const workspace = router.query?.workspace as string;
    const channel = router.query?.channel as string;
    if (!channel) return;
    httpClient.get<any, ChannelData>(`${workspace}/${channel}`).then((r) => {
      dispatch(setCurrentChannelData(r));
      return;
    });
  }, [dispatch, router.query?.channel, router.query?.workspace]);
  return;
};
