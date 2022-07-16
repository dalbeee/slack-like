import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import MenuItem from "@/common/components/MenuItem";
import { RootState } from "@/common/store/store";
import { useFetchChannels } from "../../hooks/useFetchChannels";

const ChannelMenu = () => {
  const router = useRouter();
  useFetchChannels();

  const appData = useSelector((state: RootState) => state.app);

  const handleClick = (e: React.MouseEvent) => {
    router.push(
      `/client/${router.query?.workspace as string}/${e.currentTarget.id}`
    );
  };
  if (!appData.channels) return null;
  return (
    <>
      <div className=""></div>
      <MenuItem isParent>
        채널
        {appData.channels?.map((item) => (
          <MenuItem id={item.id} key={item.id} onClick={handleClick}>
            {item.name}
          </MenuItem>
        ))}
      </MenuItem>
    </>
  );
};

export default ChannelMenu;
