import { useRouter } from "next/router";

import Content from "./Content";
import SendCommander from "./SendCommander";
import { useFetchInitialChannelData } from "../../hooks/useFetchInitialChannelData";

const ContentColumn = () => {
  useFetchInitialChannelData();

  const router = useRouter();
  return (
    <div className="w-full flex flex-col p-4">
      <Content />
      {router.query?.channel && <SendCommander />}
    </div>
  );
};

export default ContentColumn;
