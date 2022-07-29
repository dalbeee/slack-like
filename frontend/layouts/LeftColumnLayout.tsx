import ChannelMenu from "../module/app/channel/components/ChannelMenu";
import FavoriteMenu from "../module/app/channel/components/FavoriteMenu";
import NewWorkspace from "../module/app/workspace/components/NewWorkspace";
import UpperMenu from "../module/app/channel/components/UpperMenu";

const Hr = () => {
  return <div className="border-b-neutral-700 w-full border-b"></div>;
};

const LeftColumnLayout = () => {
  return (
    <div className="w-3/12">
      <NewWorkspace />
      <UpperMenu />
      <Hr />
      <FavoriteMenu />
      <ChannelMenu />
    </div>
  );
};

export default LeftColumnLayout;
