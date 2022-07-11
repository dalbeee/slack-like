import { useRouter } from "next/router";
import { useEffect } from "react";

import { connect } from "@/common/wsClient";
import AppLayout from "@/layouts/AppLayout";

const connectToServer = ({
  channelId,
  workspaceId,
}: {
  workspaceId: string;
  channelId: string;
}) => {
  console.log("ws connecting", workspaceId);

  connect({
    workspaceId,
    channelId,
  });
};

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    connectToServer({
      workspaceId: router.query?.workspace as string,
      channelId: router.query?.channel as string,
    });
  });

  return (
    <>
      <AppLayout />
    </>
  );
};

export default Page;
