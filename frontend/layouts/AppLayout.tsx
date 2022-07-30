import DataInitializer from "@/module/app/core/components/DataInitializer";
import ContentColumnLayout from "./ContentColumnLayout";
import LeftColumnLayout from "./LeftColumnLayout";
import RightColumnLayout from "./RightColumnLayout";
import TopSearchBarLayout from "./TopSearchBarLayout";

const AppLayout = () => {
  return (
    <div className="h-screen scrollbar-thumb-neutral-600">
      <DataInitializer />
      <TopSearchBarLayout />
      <div className="flex bg-neutral-900 h-content overflow-hidden">
        <LeftColumnLayout />
        <ContentColumnLayout />
        <RightColumnLayout />
      </div>
    </div>
  );
};

export default AppLayout;
