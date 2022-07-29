import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { Channel } from "@/common";
import { useFetchChannels } from "../hooks/useFetchChannels";
import { channelSearchTextScript } from "./textScript";
import { RootState } from "@/common/store/store";
import { httpClient } from "@/common/httpClient";

const ChannelController = ({
  isHover,
  subscribed,
  handleJoin,
  handleLeave,
  handleView,
}: {
  isHover: boolean;
  subscribed: boolean;
  handleView: () => void;
  handleJoin: () => void;
  handleLeave: () => void;
}) => {
  if (!isHover) return null;

  return (
    <div className="flex w-96 justify-end">
      {!subscribed ? (
        <>
          <button
            className="px-7 mx-4 border h-12 button-base"
            onClick={handleView}
          >
            보기
          </button>
          <button
            className="px-7 mx-4 border h-12 button-green"
            onClick={handleJoin}
          >
            참여
          </button>
        </>
      ) : (
        <>
          <button
            className="px-7 mx-4 border h-12 button-base"
            onClick={handleLeave}
          >
            나가기
          </button>
        </>
      )}
    </div>
  );
};

const ChannelItem = ({ channel }: { channel: Channel }) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const { fetchSubscribe, fetchUnsubscribe } = useFetchChannels();

  const [isHover, setIsHover] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const subscribed = channel?.Users.map((user) => user.id).includes(user.id);
    setSubscribed(subscribed);
  }, [channel?.Users, user]);

  if (!user) return null;

  const handleView = () => {
    router.push(`/client/${router.query.workspace as string}/${channel.id}`);
  };
  const handleJoin = () => {
    fetchSubscribe(channel.id);
  };
  const handleLeave = () => {
    fetchUnsubscribe(channel.id);
  };

  return (
    <div
      className="flex items-center justify-between hover:bg-neutral-800 bg-opacity-60"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className="w-full text-left hover:cursor-pointer"
        onClick={handleView}
      >
        <div className="p-2">
          <div className="text-xl text-neutral-300">#{channel.name}</div>
          <div className="">
            <span className="px-1">{`${subscribed ? "참여함" : ""}`}</span>
            <span className="px-1">{`${
              channel?.Users && `* ${channel.Users.length}명의 맴버`
            }`}</span>
            <span className="px-1">{channel?.description}</span>
          </div>
        </div>
      </div>
      <ChannelController
        isHover={isHover}
        handleJoin={handleJoin}
        handleView={handleView}
        handleLeave={handleLeave}
        subscribed={subscribed}
      />
    </div>
  );
};

const ChannelSearchResult = ({ channels }: { channels: Channel[] }) => {
  if (!channels.length) return null;

  return (
    <div className="pt-6">
      <div className="text-neutral-200 divide-y">
        <div className="pb-1">
          {channels.length} {channelSearchTextScript.searchResult}
        </div>
        <div className=""></div>
      </div>
      <div className="divide-y">
        {channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};

const fetchChannels = (workspaceId: string) =>
  httpClient.get<any, Channel[]>(`/channels`, { params: { workspaceId } });

const ChannelSearch = () => {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    fetchChannels(router.query.workspace as string).then((r) => setChannels(r));
  }, [router.query.workspace]);

  return (
    <div className="p-6 flex flex-col">
      <div className="pb-2 flex justify-between">
        <h1 className="text-neutral-200 font-bold">
          {channelSearchTextScript.title}
        </h1>
        <button className="px-2 py-1 border text-sm button-base">
          {channelSearchTextScript.createChannelButton}
        </button>
      </div>
      <div className="py-4">
        <input
          className="w-full"
          type=""
          placeholder={channelSearchTextScript.searchInputPlaceholder}
        />
      </div>
      <ChannelSearchResult channels={channels} />

      <div className="pt-10 flex justify-center ">
        <button className="px-3 py-2 font-bold rounded-md button-green">
          {channelSearchTextScript.createChannelButton}
        </button>
      </div>
    </div>
  );
};

export default ChannelSearch;
