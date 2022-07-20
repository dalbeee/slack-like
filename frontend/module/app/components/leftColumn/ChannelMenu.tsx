import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import MenuItem from "@/common/components/MenuItem";
import { RootState } from "@/common/store/store";

const ChannelMenu = () => {
  const router = useRouter();

  const { channels } = useSelector((state: RootState) => state.app);

  const handleClick = (e: React.MouseEvent) => {
    const as = `/client/${router.query?.workspace as string}/${
      e.currentTarget.id
    }`;
    router.push(as);
  };
  if (!channels) return null;
  return (
    <>
      <div className=""></div>
      <MenuItem isParent>
        채널
        {channels?.byId?.map((channelId) => {
          // eslint-disable-next-line security/detect-object-injection
          const channel = channels.byHash[channelId];
          return (
            <MenuItem
              id={channelId}
              key={channelId}
              onClick={handleClick}
              className={`${
                channel.lastCheckMessageId !== channel.latestMessageId
                  ? "bg-neutral-700"
                  : ""
              }`}
            >
              {channel.name}
            </MenuItem>
          );
        })}
      </MenuItem>
    </>
  );
};

export default ChannelMenu;
