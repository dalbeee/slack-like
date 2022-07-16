import { socketConnect, wsClientFactory } from "@/common/wsClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const messageCreateHandler = (message: unknown) => {
  console.log(message);
};

const Page = () => {
  const router = useRouter();
  const [wsClient, setWsClient] = useState(wsClientFactory);
  useEffect(() => {
    socketConnect(
      wsClient,
      {
        workspaceId: "a",
        channelId: "b",
      },
      [{ messageKey: "message.create", callbackFn: messageCreateHandler }]
    );
    wsClient.on("message.create", messageCreateHandler);
    console.log(wsClient);
  }, [wsClient]);
  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};
export default Page;
