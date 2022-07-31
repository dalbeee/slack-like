import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/common/store/store";
import ContentComponent from "../../core/components/ContentComponent";
import SendCommander from "./SendCommander";

const Content = () => {
  return <div className="w-3/4">ThreadViewer</div>;
};

const Title = () => {
  const { currentChannel } = useSelector((state: RootState) => state.channels);

  if (!currentChannel) return null;

  return (
    <div className="flex items-center text-light">
      스레드
      <span className="text-neutral-500 text-sm px-2">
        #{currentChannel.name}
      </span>
    </div>
  );
};

const Bottom = () => {
  const { currentChannel } = useSelector((state: RootState) => state.channels);
  return <>{currentChannel && <SendCommander target="THREAD" />}</>;
};

const ThreadViewer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { curentThreadId } = useSelector((state: RootState) => state.thread);

  useEffect(() => {
    curentThreadId ? setIsOpen(true) : setIsOpen(false);
  }, [curentThreadId]);

  if (!isOpen) return null;

  return (
    <ContentComponent
      title={<Title />}
      content={<Content />}
      bottom={<Bottom />}
    />
  );
};

export default ThreadViewer;
