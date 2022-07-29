import DataInitializer from "@/module/app/core/components/DataInitializer";
import ContentColumnLayout from "./ContentColumnLayout";
import LeftColumnLayout from "./LeftColumnLayout";
import RightColumnLayout from "./RightColumnLayout";
import TopSearchBarLayout from "./TopSearchBarLayout";

const AppLayout = () => {
  return (
    <>
      <DataInitializer />
      <TopSearchBarLayout />
      <div className="flex bg-neutral-900 min-h-content">
        <LeftColumnLayout />
        <ContentColumnLayout />
        <RightColumnLayout />
      </div>
    </>
  );
};

export default AppLayout;
