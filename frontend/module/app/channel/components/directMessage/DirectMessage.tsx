import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { Channel } from "@/common";
import MenuItem from "@/common/components/MenuItem";
import { RootState } from "@/common/store/store";
import { useFetchChannels } from "../../hooks/useFetchChannels";

const DirectMessageMenu = () => {
  const router = useRouter();
  const { directMessageChannels, fetchManyDMChannels } = useFetchChannels();
  const { user: currentUser } = useSelector((state: RootState) => state.user);
  const { currentWorkspaceId } = useSelector(
    (state: RootState) => state.workspaces
  );

  useEffect(() => {
    if (!currentUser || !currentUser?.id || !currentWorkspaceId) return;
    fetchManyDMChannels(currentUser.id);
  }, [currentWorkspaceId, fetchManyDMChannels, currentUser]);

  if (!directMessageChannels || !currentUser) return null;

  const handleClick = (channel: Channel) => {
    if (!router.isReady) return;
    router.push(`/client/${currentWorkspaceId}/${channel.id}`);
  };

  const handlePushAllDms = () => {
    router.push(`/client/${currentWorkspaceId}/all-dms`);
  };

  return (
    <>
      <MenuItem isParent>
        다이렉트 메시지
        <button onClick={handlePushAllDms}>+</button>
      </MenuItem>
      {directMessageChannels.map((channel) => {
        const dmFallower = channel.users.filter(
          (user) => user.id !== currentUser.id
        )[0];

        return (
          <MenuItem key={channel.id} onClick={() => handleClick(channel)}>
            <span className="material-symbols-outlined">person</span>
            {dmFallower.name}
          </MenuItem>
        );
      })}
    </>
  );
};

export default DirectMessageMenu;
