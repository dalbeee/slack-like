import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { httpClient } from "@/common/httpClient";
import { Channel } from "@/common/types";

export const useChannelMenu = () => {
  const [data, setData] = useState<Channel[]>([] as Channel[]);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const workspace = router.query.workspace as string;
    httpClient.get<any, Channel[]>(`/${workspace}`).then((r) => {
      setData(r);
      return;
    });
  }, [router.isReady, router.query.workspace]);

  return { data };
};
