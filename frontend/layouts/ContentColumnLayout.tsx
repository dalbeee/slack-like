import { ReactNode } from "react";

const ContentColumnLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex flex-col border border-t-0">{children}</div>
  );
};

export default ContentColumnLayout;
