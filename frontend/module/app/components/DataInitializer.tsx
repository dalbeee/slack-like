import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useSocketConnect } from "@/module/app/hooks/useSocketConnect";
import { RootState } from "@/common/store/store";
import { useFetchChannelMetadata } from "../hooks/useFetchChannelMetadata";
import { useFetchChannels } from "../hooks/useFetchChannels";

const DataInitializer = () => {
  useSocketConnect();
  const router = useRouter();
  const dispatch = useDispatch();
  const { initialize } = useSelector((state: RootState) => state.app);
  const { fetch: fetchChannelDatadata } = useFetchChannelMetadata();
  const { fetch: fetchChannels } = useFetchChannels();

  useEffect(() => {
    if (!router.isReady || initialize) return;
    fetchChannelDatadata();
    fetchChannels();
  }, [
    dispatch,
    fetchChannelDatadata,
    fetchChannels,
    initialize,
    router.isReady,
    router.query.workspace,
  ]);

  useEffect(() => {
    if (!router.query.channel) return;
  }, [router.query.channel, router.query.workspace]);

  return <></>;
};

export default DataInitializer;
