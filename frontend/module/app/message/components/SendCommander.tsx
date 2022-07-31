import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/common/store/store";
import { useWsMessageOutbound } from "../../message/hooks/useWsMessageOutbound";
import { MessageCreateTarget } from "@/common";

const SendCommander = ({ target }: { target: MessageCreateTarget }) => {
  const { createMessage } = useWsMessageOutbound();
  const { currentChannel } = useSelector((state: RootState) => state.channels);
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    return () => {
      setMessage("");
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;

    createMessage({ content: message, target });
    setMessage("");
  };

  if (!currentChannel) return null;

  return (
    <>
      <div className="group">
        <div className=" border border-neutral-400 rounded-xl p-2  group-focus-within:border-neutral-200">
          <div className="group-focus-within:text-neutral-400">엘레먼트들</div>
          <form action="" onSubmit={handleSubmit}>
            <input
              ref={ref}
              className="w-full text-xl py-2 text-light focus:outline-none focus:ring-0 placeholder:text-neutral-400 placeholder:text-sm"
              type="text"
              placeholder={`${currentChannel?.name} # 에 메세지 보내기.`}
              onChange={handleInputChange}
              value={message}
            />
          </form>
          <BottomMenu />
        </div>
      </div>
    </>
  );
};

const BottomMenu = () => (
  <div className="flex justify-between">
    <div className="flex divide-x">
      <div className="flex pr-2">
        <span className="px-2 material-symbols-outlined">add_circle</span>
      </div>
      <div className="flex px-2">
        <span className="px-2 material-symbols-outlined">videocam</span>
        <span className="px-2 material-symbols-outlined">mic</span>
      </div>
      <div className="flex px-2">
        <span className="px-2 material-symbols-outlined">
          sentiment_satisfied
        </span>
        <span className="px-2 material-symbols-outlined">alternate_email</span>
        <span className="px-2 material-symbols-outlined">format_paragraph</span>
      </div>
    </div>
    <div className="flex divide-x items-center bg-emerald-600 rounded px-2 py-1">
      <span className="text-neutral-50 px-1 material-symbols-outlined">
        send
      </span>
      <span className="text-neutral-50 material-symbols-outlined">
        expand_more
      </span>
    </div>
  </div>
);

export default SendCommander;
