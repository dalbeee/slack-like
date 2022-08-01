import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "@/common/store/store";
import ContentComponent from "../../core/components/ContentComponent";
import SendCommander from "./SendCommander";
import { Content as MessageViewer } from "@/module/app/message/components/MessagesViewer";

const Content = () => {
  const { thread } = useSelector((state: RootState) => state.thread);
  return (
    <MessageViewer
      channelOrThreadData={thread.comments}
      eventOutboundTarget={"THREAD"}
    />
  );
};

const Title = () => {
  const { currentChannel } = useSelector((state: RootState) => state.channels);
  const router = useRouter();
  const { currentWorkspaceId } = useSelector(
    (state: RootState) => state.workspaces
  );

  const handleClose = () => {
    if (!currentChannel) return;
    router.push(`/client/${currentWorkspaceId}/${currentChannel.id}`);
  };

  if (!currentChannel) return null;

  return (
    <div className="flex items-center text-light justify-between">
      <div>
        스레드
        <span className="text-neutral-500 text-sm px-2">
          #{currentChannel.name}
        </span>
      </div>
      <button className="flex items-center" onClick={handleClose}>
        <span className="font-bold material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

const Bottom = () => {
  const { currentChannel } = useSelector((state: RootState) => state.channels);

  if (!currentChannel) return null;

  return <SendCommander eventOutboundTarget="THREAD" />;
};

const ThreadViewer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { curentThreadId } = useSelector((state: RootState) => state.thread);

  useEffect(() => {
    curentThreadId ? setIsOpen(true) : setIsOpen(false);
  }, [curentThreadId]);

  if (!isOpen) return null;

  return (
    <div className="w-5/12 border border-t-0 border-l-0">
      <ContentComponent
        title={<Title />}
        content={<Content />}
        bottom={<Bottom />}
      />
    </div>
  );
};

export default ThreadViewer;
