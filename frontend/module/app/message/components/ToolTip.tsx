import {
  ComponentProps,
  Dispatch,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { Message } from "@/common";
import ToolTipExpand from "./ToolTipExpand";
import { useWsMessageOutbound } from "../../message/hooks/useWsMessageOutbound";
import { RootState } from "@/common/store/store";

const ButtonItem = ({
  handleClick,
  children,
}: {
  children: React.ReactNode;
  handleClick?: (arg: unknown) => unknown;
}) => {
  return (
    <button className="px-2" onClick={handleClick}>
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
    const { createReaction } = useWsMessageOutbound();
    const router = useRouter();
    const { currentWorkspaceId } = useSelector(
      (state: RootState) => state.workspaces
    );
    const { currentChannel } = useSelector(
      (state: RootState) => state.channels
    );

    const handleToggleExpand = () => {
      setIsHighliterLocked((prev) => !prev);
      setIsOnExpand((prev) => !prev);
      hightlightedRowId
        ? setHighlightedRowId(messageData.id)
        : setHighlightedRowId(null);
    };

    const handleReaction = (content: string) => {
      createReaction({ content, messageId: messageData.id });
      return;
    };

    const handleOpenThread = () => {
      if (!currentChannel) return;
      router.push(
        `/client/${currentWorkspaceId}/${currentChannel.id}/thread/${messageData.id}`,
        undefined,
        { shallow: true }
      );
    };

    if (!currentChannel) return null;

    return (
      <>
        <div
          className="z-50 flex justify-center items-center border rounded-lg bg-neutral-900 border-neutral-700 p-2"
          {...props}
        >
          <ButtonItem handleClick={() => handleReaction("☑️")}>
            <span className="material-symbols-outlined">check_box</span>
          </ButtonItem>
          <ButtonItem handleClick={() => handleReaction("👀")}>
            <span className="material-symbols-outlined">visibility</span>
          </ButtonItem>
          <ButtonItem handleClick={() => handleReaction("👍")}>
            <span className="material-symbols-outlined">thumb_up</span>
          </ButtonItem>
          {/* TODO add reactions */}
          <ButtonItem>
            <span className="material-symbols-outlined">add_reaction</span>
          </ButtonItem>
          <ButtonItem handleClick={handleOpenThread}>
            <span className="material-symbols-outlined">comment</span>
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
          <ToolTipExpand messageData={messageData} ref={ref} />
        )}
      </>
    );
  }
);

export default ToolTip;
