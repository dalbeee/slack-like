import { useState } from "react";

import ToolTipExpand from "./ToolTipExpand";

const ButtonItem = ({
  handleClick,
  children,
}: {
  children: React.ReactNode;
  handleClick?: (arg: unknown) => unknown;
}) => {
  return (
    <button className="px-1" onClick={handleClick}>
      {children}
    </button>
  );
};

const ToolTip = () => {
  const [isOnExpand, setIsOnExpand] = useState(false);
  const handleExpand = () => {
    setIsOnExpand((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-center items-center border rounded-lg bg-neutral-900 border-neutral-700 p-2">
        <ButtonItem>
          <span className="material-symbols-outlined">check_box</span>
        </ButtonItem>
        <ButtonItem>
          <span className="material-symbols-outlined">visibility</span>
        </ButtonItem>
        <ButtonItem>
          <span className="material-symbols-outlined">thumb_up</span>
        </ButtonItem>
        <ButtonItem>
          <span className="material-symbols-outlined">add_reaction</span>
        </ButtonItem>
        <ButtonItem>
          <span className="material-symbols-outlined">forward</span>
        </ButtonItem>
        <ButtonItem>
          <span className="material-symbols-outlined">bookmark</span>
        </ButtonItem>
        <ButtonItem handleClick={handleExpand}>
          <span className="material-symbols-outlined">more_vert</span>
        </ButtonItem>
      </div>
      {isOnExpand && <ToolTipExpand />}
    </>
  );
};

export default ToolTip;
