import { ReactNode } from "react";

import DataInitializer from "@/module/app/core/components/DataInitializer";
import ContentColumnLayout from "./ContentColumnLayout";
import LeftColumnLayout from "./LeftColumnLayout";
import RightColumnLayout from "./RightColumnLayout";
import TopSearchBarLayout from "./TopSearchBarLayout";

const AppLayout = ({
  content,
  sideBar,
}: {
  content: ReactNode;
  sideBar?: ReactNode;
}) => {
  return (
    <div className="h-screen scrollbar-thumb-neutral-600">
      <DataInitializer />
      <TopSearchBarLayout />
      <div className="flex bg-neutral-900/95 h-content overflow-hidden">
        <LeftColumnLayout />
        <ContentColumnLayout>{content}</ContentColumnLayout>
        <RightColumnLayout>{sideBar}</RightColumnLayout>
      </div>
    </div>
  );
};

export default AppLayout;
