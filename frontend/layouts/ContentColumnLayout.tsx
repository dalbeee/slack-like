import ContentRouter from "@/module/app/core/components/ContentRouter";

const ContentColumnLayout = () => {
  return (
    <div className="w-full flex flex-col border border-t-0">
      <ContentRouter />
    </div>
  );
};

export default ContentColumnLayout;
