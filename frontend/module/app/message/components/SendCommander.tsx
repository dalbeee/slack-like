import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { useWsMessageOutbound } from "../../message/hooks/useWsMessageOutbound";

const SendCommander = () => {
  const router = useRouter();
  const { createMessage } = useWsMessageOutbound();
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    return () => {
      setMessage("");
    };
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    createMessage(message);
    setMessage("");
  };

  return (
    <>
      <div className="group">
        <div className=" border border-neutral-400 rounded-xl p-2  group-focus-within:border-neutral-200">
          <div className="group-focus-within:text-neutral-400">엘레먼트들</div>
          <form action="" onSubmit={handleSubmit}>
            <input
              ref={ref}
              className="w-full text-xl py-2 text-neutral-300"
              type="text"
              placeholder={`# 에 메세지 보내기.`}
              onChange={handleInputChange}
              value={message}
            />
          </form>
          <div className="group-focus-within:text-neutral-400">하단메뉴들</div>
        </div>
      </div>
    </>
  );
};

export default SendCommander;
