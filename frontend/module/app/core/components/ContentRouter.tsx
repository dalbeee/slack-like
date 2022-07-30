import { useRouter } from "next/router";

import ChannelSearch from "../../channel/components/ChannelSearch";
import DirectMessageContent from "../../channel/components/directMessage/DirectMessageContent";
import MessagesViewer from "../../message/components/MessagesViewer";
import SendCommander from "../../message/components/SendCommander";

const ContentRouter = () => {
  const router = useRouter();

  if (router.query.channel === "browse-channels") return <ChannelSearch />;
  if (router.query.channel === "all-dms") return <DirectMessageContent />;

  return (
    <>
      <MessagesViewer />
      {router.query?.channel && <SendCommander />}
    </>
  );
};

export default ContentRouter;
