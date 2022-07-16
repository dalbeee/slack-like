import ChannelMenu from "../module/app/components/leftColumn/ChannelMenu";
import FavoriteMenu from "../module/app/components/leftColumn/FavoriteMenu";
import NewWorkspace from "../module/app/components/leftColumn/NewWorkspace";
import UpperMenu from "../module/app/components/leftColumn/UpperMenu";

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
