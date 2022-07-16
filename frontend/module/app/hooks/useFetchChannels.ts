import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { httpClient } from "@/common/httpClient";
import { Channel } from "@/common";
import { setChannels } from "@/common/store/appSlice";

export const useFetchChannels = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const workspace = router.query.workspace as string;
    httpClient.get<any, Channel[]>(`/${workspace}`).then((r) => {
      dispatch(setChannels(r));
      return;
    });
  }, [dispatch, router.isReady, router.query.workspace]);

  return;
};
