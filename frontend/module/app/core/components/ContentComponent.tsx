import { FC, ReactNode } from "react";

const ContentComponent: FC<{ title: string; children: ReactNode }> = ({
  children,
  title,
}) => {
  return (
    <div className="h-full divide-y">
      <div className="px-4 py-2 text-light text-2xl font-bold">{title}</div>
      {children}
    </div>
  );
};

export default ContentComponent;
