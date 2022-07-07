import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { httpClient } from "@/common/httpClient";
import SendCommander from "./SendCommander";

type Channel = {
  Messages: {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
  }[];
};

const Content = () => {
  const router = useRouter();

  const [enabled, setEnabled] = useState(false);
  const { data } = useQuery(
    `${router.query?.workspace as string}/${router.query?.channel as string}`,
    async () => {
      return await httpClient.get<any, Channel>(
        `/${router.query?.workspace as string}/${
          router.query?.channel as string
        }`
      );
    },
    { enabled }
  );

  useEffect(() => {
    if (!router.isReady) return;
    setEnabled(true);
  }, [router.isReady]);

  return (
    <div className="">
      {data?.Messages.map((m) => (
        <div className="text-neutral-300" key={m.id}>
          {m.content}
        </div>
      ))}
    </div>
  );
};

const ContentColumn = () => {
  return (
    <div className=" w-full">
      <Content />
      <SendCommander />
    </div>
  );
};

export default ContentColumn;
