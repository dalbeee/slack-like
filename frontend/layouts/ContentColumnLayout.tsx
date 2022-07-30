import ContentRouter from "@/module/app/core/components/ContentRouter";

const ContentColumnLayout = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <ContentRouter />
    </div>
  );
};

export default ContentColumnLayout;
