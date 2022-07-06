import ContentColumn from "@components/ContentColumn";
import LeftColumn from "@components/leftColumn/LeftColumn";
import RightColumn from "@components/RightColumn";
import TopSearchBar from "@components/TopSearchBar";

const AppLayout = () => {
  return (
    <>
      <TopSearchBar />
      <div className="flex bg-neutral-900 min-h-content">
        <LeftColumn />
        <ContentColumn />
        <RightColumn />
      </div>
    </>
  );
};

export default AppLayout;
