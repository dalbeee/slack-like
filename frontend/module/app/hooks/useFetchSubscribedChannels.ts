import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { httpClient } from "@/common/httpClient";
import { ChannelDataResponse } from "@/common";
import { setChannels } from "@/common/store/appSlice";

export const useFetchSubscribedChannels = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchSubscribedChannels = () => {
    httpClient
      .get<any, ChannelDataResponse>(`/users/subscribed-channels`, {
        params: { workspaceId: router.query?.workspace as string },
      })
      .then((r) => {
        dispatch(setChannels(r));
        return;
      });
  };

  return { fetchSubscribedChannels };
};
