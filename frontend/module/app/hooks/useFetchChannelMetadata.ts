import { useRouter } from "next/router";

import { httpClient } from "@/common/httpClient";
import { useDispatch } from "react-redux";
import { setChannelsMetadata } from "@/common/store/appSlice";
import { HttpChannelMetadataResponse } from "@/common";

export const useFetchChannelMetadata = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchChannelMetadata = () =>
    httpClient
      .get<any, HttpChannelMetadataResponse>(
        `/users/metadata?workspaceId=${router.query.workspace as string}`
      )
      .then((r) => {
        dispatch(setChannelsMetadata(r));
        return;
      });

  return { fetchChannelMetadata };
};
