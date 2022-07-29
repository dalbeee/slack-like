import { useRouter } from "next/router";
import ChannelSearch from "../../channel/components/ChannelSearch";
import MessagesViewer from "../../message/components/MessagesViewer";
import SendCommander from "../../message/components/SendCommander";

const ContentRouter = () => {
  const router = useRouter();

  if (router.query.channel === "browse-channels") return <ChannelSearch />;

  return (
    <>
      <MessagesViewer />
      {router.query?.channel && <SendCommander />}
    </>
  );
};

export default ContentRouter;
