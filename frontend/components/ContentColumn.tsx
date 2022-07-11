import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { httpClient } from "@/common/httpClient";
import SendCommander from "./SendCommander";
import { FetchData, Message } from "@/common/types";
import { connect, wsClientFactory } from "@/common/wsClient";

const Content = ({ data }: { data: FetchData }) => {
  if (!data) return null;
  return (
    <div className="h-full">
      {!!data?.Messages?.length &&
        data?.Messages.map((m) => (
          <div className="text-neutral-300" key={m.id}>
            {m.content}
          </div>
        ))}
    </div>
  );
};

const ContentColumn = () => {
  const [wsClient] = useState(() => wsClientFactory());
  const router = useRouter();
  const [data, setData] = useState<FetchData>({} as FetchData);
  const addData = (data: Message) => {
    setData((prev) => ({ ...prev, Messages: [...prev.Messages, data] }));
  };

  useEffect(() => {
    if (!router.isReady) return;
    const fetchData = () => {
      httpClient
        .get<any, FetchData>(
          `${router.query?.workspace as string}/${
            router.query?.channel as string
          }`
        )
        .then((r) => {
          setData(r);
          return;
        });
    };
    fetchData();

    return () => {
      setData({} as FetchData);
    };
  }, [router.isReady, router.query?.channel, router.query?.workspace]);

  useEffect(() => {
    connect(
      wsClient,
      {
        workspaceId: router.query?.workspace as string,
        channelId: router.query?.channel as string,
      },
      addData
    );
  }, [router.query?.channel, router.query?.workspace, wsClient]);

  return (
    <div className="w-full flex flex-col p-4">
      <Content data={data} />
      {router.query?.channel && <SendCommander ws={wsClient} />}
    </div>
  );
};

export default ContentColumn;
