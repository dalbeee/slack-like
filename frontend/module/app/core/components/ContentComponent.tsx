import { FC, ReactNode } from "react";

const ContentComponent: FC<{
  title: ReactNode;
  content: ReactNode;
  bottom?: ReactNode;
}> = ({ title, content, bottom }) => {
  return bottom ? (
    <div className="h-content grid grid-rows-contentWithBottom divide-y">
      <div className="h-contentTitle px-4 py-2 text-light text-2xl font-bold">
        {title}
      </div>
      <div className="scrollbar-base">{content}</div>
      <div className="">{bottom}</div>
    </div>
  ) : (
    <div className="h-content grid grid-rows-contentWithoutBottom divide-y">
      <div className="h-contentTitle px-4 py-2 text-light text-2xl font-bold">
        {title}
      </div>
      <div className="scrollbar-base">{content}</div>
    </div>
  );
};

export default ContentComponent;
