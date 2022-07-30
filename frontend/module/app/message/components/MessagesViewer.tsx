import { MouseEvent, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import ToolTip from "./ToolTip";
import { useWsChannelOutbound } from "../../channel/hooks/useWsChannelOutbound";
import { useFetchMessages } from "../hooks/useFetchMessages";
import ContentComponent from "../../core/components/ContentComponent";
import { RootState } from "@/common/store/store";
import SendCommander from "./SendCommander";

const Content = () => {
  const { fetchMessages, messages } = useFetchMessages();
  const { setZeroUnreadMessageCount } = useWsChannelOutbound();
  const [isHighliterLocked, setIsHighliterLocked] = useState(false);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [isOnExpand, setIsOnExpand] = useState(false);
  const toolTipExpandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    setZeroUnreadMessageCount();
  }, [setZeroUnreadMessageCount]);

  const handleHighlight = (id: string | null) => {
    if (isHighliterLocked) return;
    setHighlightedRowId(id);
  };

  const handleClickBackground = (e: MouseEvent<HTMLElement>) => {
    if (!toolTipExpandRef.current) return;
    if (toolTipExpandRef.current?.contains(e.currentTarget)) {
      return;
    }
    setHighlightedRowId(null);
    setIsHighliterLocked(false);
    setIsOnExpand(false);
  };

  if (!messages) return null;

  return (
    <div className="" onClick={handleClickBackground}>
      {messages.map((m) => (
        <div
          className={`relative group bg-opacity-50 justify-between py-2 flex ${
            highlightedRowId === m.id ? "bg-neutral-700" : ""
          }`}
          key={m.id}
          onMouseOver={() => handleHighlight(m.id)}
          onMouseLeave={() => handleHighlight(null)}
        >
          <div className="">
            <span
              className={`inline-block text-neutral-400 w-20 text-center text-sm ${
                highlightedRowId === m.id ? "visible" : "invisible"
              }`}
            >
              {dayjs(m.createdAt).format("HH:mm")}
            </span>
            <span className="text-neutral-400 text-lg">{m.content}</span>
          </div>
          <div
            className={`z-10 inline-block absolute -right-0 -top-4  ${
              highlightedRowId === m.id ? "visible" : "invisible"
            }`}
          >
            <ToolTip
              messageData={m}
              hightlightedRowId={highlightedRowId}
              setHighlightedRowId={setHighlightedRowId}
              setIsHighliterLocked={setIsHighliterLocked}
              isOnExpand={isOnExpand}
              setIsOnExpand={setIsOnExpand}
              ref={toolTipExpandRef}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const Title = () => {
  const { currentChannel } = useSelector((state: RootState) => state.channels);
  const { user: currentUser } = useSelector((state: RootState) => state.user);

  if (!currentChannel || !currentUser) return null;

  const opponentUser = currentChannel.Users.filter(
    (user) => user.id !== currentUser.id
  )[0];
  const channelName =
    currentChannel.type === "PUBLIC" || currentChannel.type === "PRIVATE"
      ? currentChannel.name
      : currentChannel.type === "DIRECT_MESSAGE" && opponentUser.name;

  return (
    <div className="flex items-center text-light">
      {channelName}
      <button className="material-symbols-outlined">expand_more</button>
    </div>
  );
};

const Bottom = () => {
  const { currentChannel } = useSelector((state: RootState) => state.channels);
  return <>{currentChannel && <SendCommander />}</>;
};

const MessagesViewer = () => {
  return (
    <ContentComponent
      title={<Title />}
      content={<Content />}
      bottom={<Bottom />}
    />
  );
};

export default MessagesViewer;
