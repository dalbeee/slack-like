import { MouseEvent, useRef, useState } from "react";
import dayjs from "dayjs";

import { FetchData } from "@/common/types";
import ToolTip from "./ToolTip";
import { Socket } from "socket.io-client";

const Content = ({ ws, data }: { ws: Socket; data: FetchData }) => {
  const [isHighliterLocked, setIsHighliterLocked] = useState(false);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [isOnExpand, setIsOnExpand] = useState(false);
  const toolTipExpandRef = useRef<HTMLDivElement>(null);

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

  if (!data) return null;

  return (
    <div className="h-full" onClick={handleClickBackground}>
      {!!data?.Messages?.length &&
        data?.Messages.map((m) => (
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
                ws={ws}
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

export default Content;
