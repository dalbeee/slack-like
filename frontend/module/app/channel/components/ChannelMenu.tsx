import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import MenuItem from "@/common/components/MenuItem";
import { RootState } from "@/common/store/store";
import ChannelCreateButton from "./ChannelCreateButton";

const ChannelMenu = () => {
  const router = useRouter();

  const { subscribedChannels } = useSelector(
    (state: RootState) => state.channels
  );

  if (!subscribedChannels) return null;

  const handleClick = (e: React.MouseEvent) => {
    const as = `/client/${router.query?.workspace as string}/${
      e.currentTarget.id
    }`;
    router.push(as);
  };

  return (
    <>
      <MenuItem isParent>채널</MenuItem>
      {subscribedChannels?.map((channel) => {
        return (
          <MenuItem
            id={channel.id}
            key={channel.id}
            onClick={handleClick}
            className={`${channel.unreadMessageCount ? "bg-neutral-700" : ""}`}
          >
            <span className="material-symbols-outlined w-6 h-6">tag</span>
            {channel.name}
          </MenuItem>
        );
      })}
      <ChannelCreateButton />
    </>
  );
};

export default ChannelMenu;
