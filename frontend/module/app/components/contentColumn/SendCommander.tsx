import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { createMessage, socketFactory } from "@/common/wsClient";

const SendCommander = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    return () => {
      setValue("");
    };
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      socketInfo: {
        workspaceId: router.query?.workspace as string,
        channelId: router.query?.channel as string,
      },
      message: value,
    };
    createMessage(socketFactory(), data);
    setValue("");
  };

  return (
    <>
      <div className="group">
        <div className=" border border-neutral-400 rounded-xl p-2  group-focus-within:border-neutral-200">
          <div className="group-focus-within:text-neutral-400">엘레먼트들</div>
          <form action="" onSubmit={handleSubmit}>
            <input
              ref={ref}
              className="block w-full text-xl bg-transparent py-2 text-neutral-300 focus:outline-none"
              type="text"
              placeholder={`# 에 메세지 보내기.`}
              onChange={handleInputChange}
              value={value}
            />
          </form>
          <div className="group-focus-within:text-neutral-400">하단메뉴들</div>
        </div>
      </div>
    </>
  );
};

export default SendCommander;
