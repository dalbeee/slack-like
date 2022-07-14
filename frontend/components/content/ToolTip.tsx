import { Message } from "@/common/types";
import {
  ComponentProps,
  Dispatch,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from "react";

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

type ToolTipProps = {
  messageData: Message;
  hightlightedRowId: string | null;
  setHighlightedRowId: Dispatch<any>;
  setIsHighliterLocked: Dispatch<SetStateAction<boolean>>;
  isOnExpand: boolean;
  setIsOnExpand: Dispatch<SetStateAction<boolean>>;
};

const ToolTip: ForwardRefExoticComponent<
  RefAttributes<HTMLDivElement> & ComponentProps<"div"> & ToolTipProps
  // eslint-disable-next-line react/display-name
> = forwardRef(
  (
    {
      messageData,
      hightlightedRowId,
      setHighlightedRowId,
      setIsHighliterLocked,
      isOnExpand,
      setIsOnExpand,
      ...props
    }: ToolTipProps,
    ref
  ) => {
    const handleToggleExpand = () => {
      setIsHighliterLocked((prev) => !prev);
      setIsOnExpand((prev) => !prev);
      hightlightedRowId
        ? setHighlightedRowId(messageData.id)
        : setHighlightedRowId(null);
    };

    return (
      <>
        <div
          className="z-50 flex justify-center items-center border rounded-lg bg-neutral-900 border-neutral-700 p-2"
          {...props}
        >
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
          <ButtonItem handleClick={handleToggleExpand}>
            <span className="material-symbols-outlined">more_vert</span>
          </ButtonItem>
        </div>
        {isOnExpand && hightlightedRowId === messageData.id && (
          <ToolTipExpand ref={ref} />
        )}
      </>
    );
  }
);

export default ToolTip;
