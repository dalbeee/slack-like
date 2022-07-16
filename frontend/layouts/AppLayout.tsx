import SocketInitializer from "@/module/app/components/SocketInitializer";
import ContentColumnLayout from "./ContentColumnLayout";
import LeftColumnLayout from "./LeftColumnLayout";
import RightColumnLayout from "./RightColumnLayout";
import TopSearchBarLayout from "./TopSearchBarLayout";

const AppLayout = () => {
  return (
    <>
      <SocketInitializer />
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
