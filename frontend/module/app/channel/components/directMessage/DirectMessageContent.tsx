import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Channel } from "@/common";
import { RootState } from "@/common/store/store";
import { useFetchChannels } from "../../hooks/useFetchChannels";
import ContentComponent from "@/module/app/core/components/ContentComponent";

const DirectMessageContentItem = ({
  channelData,
}: {
  channelData: Channel;
}) => {
  const router = useRouter();
  const { user: currentUser } = useSelector((state: RootState) => state.user);
  const { currentWorkspaceId } = useSelector(
    (state: RootState) => state.workspaces
  );

  const date = dayjs(channelData.messages[0].createdAt)
    .locale("ko")
    .format("MM월 DD일 dddd");
  const time = dayjs(channelData.messages[0].createdAt)
    .locale("ko")
    .format("a HH:mm");
  const opponentUser = channelData.users.filter(
    (user) => user.id !== currentUser?.id
  )[0];

  const handleClick = () => {
    if (!router.isReady) return;
    router.push(`/client/${currentWorkspaceId}/${channelData.id}`);
  };

  return (
    <div className="p-4">
      <div className="pl-4 py-2 text-light font-semibold">{date}</div>

      <div
        className="p-4 flex rounded-xl bg-neutral-900 w-full justify-between hover:cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex w-full">
          <img
            className="rounded-lg mr-2"
            src={opponentUser.avatar ?? "/avatar_default.png"}
            alt="avatar"
          />
          <div className="">
            <div className="text-light font-semibold">{opponentUser.name}</div>
            <span>{channelData.messages[0].content}</span>
          </div>
        </div>
        <div className="w-28">{time}</div>
      </div>
    </div>
  );
};

const Content = () => {
  const { directMessageChannels } = useFetchChannels();

  return (
    <>
      <div className="px-4 py-1 flex items-center">
        <span className="w-24">받는 사람:</span>
        <input
          className="focus:ring-0 w-full"
          placeholder="@이름 또는 이름@도메인.com"
        />
      </div>
      <div className="bg-neutral-800 h-content scrollbar-base">
        {directMessageChannels.map((channel) => {
          return (
            <DirectMessageContentItem key={channel.id} channelData={channel} />
          );
        })}
      </div>
    </>
  );
};

const DirectMessageContent = () => {
  return <ContentComponent title="다이렉트 메시지" content={<Content />} />;
};

export default DirectMessageContent;
