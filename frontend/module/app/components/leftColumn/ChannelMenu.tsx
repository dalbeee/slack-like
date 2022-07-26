import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import MenuItem from "@/common/components/MenuItem";
import { RootState } from "@/common/store/store";

const ChannelMenu = () => {
  const router = useRouter();
  const { workspace } = router.query;
  const { workspaces } = useSelector((state: RootState) => state.app);

  const channels =
    workspaces.byHash?.[router.query?.workspace as string]?.channels;

  if (!channels || !workspace) return null;

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
        {channels?.byId?.map((channelId) => {
          // eslint-disable-next-line security/detect-object-injection
          const channel = channels.byHash[channelId];
          return (
            <MenuItem
              id={channelId}
              key={channelId}
              onClick={handleClick}
              className={`${
                channel.unreadMessageCount ? "bg-neutral-700" : ""
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
