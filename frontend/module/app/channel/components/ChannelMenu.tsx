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
      <div className=""></div>
      <MenuItem isParent>
        채널
        {subscribedChannels?.map((channel) => {
          return (
            <MenuItem
              id={channel.id}
              key={channel.id}
              onClick={handleClick}
              className={`${
                channel.unreadMessageCount ? "bg-neutral-700" : ""
              }`}
            >
              {channel.name}
            </MenuItem>
          );
        })}
        <ChannelCreateButton />
      </MenuItem>
    </>
  );
};

export default ChannelMenu;
