import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { httpClient } from "@/common/httpClient";
import { Channel } from "@/common";
import { setChannels } from "@/common/store/appSlice";

export const useFetchChannels = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const fetch = () =>
    httpClient
      .get<any, Channel[]>(
        `/channels?workspaceId=${router.query.workspace as string}`
      )
      .then((r) => {
        dispatch(setChannels(r));
        return;
      });

  return { fetch };
};
