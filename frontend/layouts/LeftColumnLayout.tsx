import ChannelMenu from "../module/app/channel/components/ChannelMenu";
import FavoriteMenu from "../module/app/channel/components/FavoriteMenu";
import NewWorkspace from "../module/app/workspace/components/NewWorkspace";
import UpperMenu from "../module/app/channel/components/UpperMenu";
import DirectMessageLayout from "@/module/app/channel/components/directMessage/DirectMessageLayout";

const Hr = () => {
  return <div className="border-b-neutral-700 w-full border-b"></div>;
};

const LeftColumnLayout = () => {
  return (
    <div className="w-2/12 pl-2 sm:w-3/12 divide-y">
      <NewWorkspace />
      <div className="h-leftColumnContent scrollbar-base">
        <UpperMenu />
        <Hr />
        <FavoriteMenu />
        <ChannelMenu />
        <DirectMessageLayout />
      </div>
    </div>
  );
};

export default LeftColumnLayout;
