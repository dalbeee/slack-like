import { useRouter } from "next/router";
import React, { useEffect } from "react";

import MenuItem from "@/components/common/MenuItem";
import { useChannelMenu } from "./channelMenu/useChannelMenu";

const ChannelMenu = () => {
  const router = useRouter();
  const { data, enabled } = useChannelMenu({
    workspace: router.query?.workspace as string,
  });

  useEffect(() => {
    if (!router.isReady) return;
    enabled(true);
  }, [enabled, router.isReady]);

  const handleClick = (e: React.MouseEvent) => {
    router.push(
      `/client/${router.query?.workspace as string}/${e.currentTarget.id}`
    );
  };

  return (
    <>
      <div className=""></div>
      <MenuItem isParent>
        채널
        {data?.map((item) => (
          <MenuItem id={item.id} key={item.id} onClick={handleClick}>
            {item.name}
          </MenuItem>
        ))}
      </MenuItem>
    </>
  );
};

export default ChannelMenu;
