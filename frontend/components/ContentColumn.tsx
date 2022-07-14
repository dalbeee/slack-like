import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { httpClient } from "@/common/httpClient";
import SendCommander from "./SendCommander";
import { FetchData, Message } from "@/common/types";
import { socketConnect, wsClientFactory } from "@/common/wsClient";
import Content from "./content/Content";

const ContentColumn = () => {
  const [wsClient] = useState(() => wsClientFactory());
  const router = useRouter();
  const [data, setData] = useState<FetchData>({} as FetchData);

  const addRow = (data: Message) => {
    setData((prev) => ({ ...prev, Messages: [...prev.Messages, data] }));
  };
  const deleteRow = (data: string) => {
    setData((prev) => ({
      ...prev,
      Messages: prev.Messages.filter((row) => row.id !== data),
    }));
  };

  useEffect(() => {
    if (!router.isReady) return;
    const fetchData = () => {
      const workspace = router.query?.workspace as string;
      const channel = router.query?.channel as string;
      if (!channel) return;
      httpClient.get<any, FetchData>(`${workspace}/${channel}`).then((r) => {
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
    socketConnect(
      wsClient,
      {
        workspaceId: router.query?.workspace as string,
        channelId: router.query?.channel as string,
      },
      [
        { messageKey: "message.create", callbackFn: addRow },
        { messageKey: "message.delete", callbackFn: deleteRow },
      ]
    );
  }, [router.query?.channel, router.query?.workspace, wsClient]);

  return (
    <div className="w-full flex flex-col p-4">
      <Content ws={wsClient} data={data} />
      {router.query?.channel && <SendCommander ws={wsClient} />}
    </div>
  );
};

export default ContentColumn;
