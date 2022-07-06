import FavoriteMenu from "./FavoriteMenu";
import NewWorkspace from "./NewWorkspace";
import UpperMenu from "./UpperMenu";

const Hr = () => {
  return <div className="border-b-neutral-700 w-full border-b"></div>;
};

const LeftColumn = () => {
  return (
    <div className="w-3/12">
      <NewWorkspace />
      <UpperMenu />
      <Hr />
      <FavoriteMenu />
    </div>
  );
};

export default LeftColumn;
