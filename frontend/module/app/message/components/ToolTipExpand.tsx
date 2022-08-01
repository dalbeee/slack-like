import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";

import { Message, EventOutboundTarget } from "@/common";
import MenuItem from "../../../../common/components/MenuItem";
import { useWsMessageOutbound } from "../../message/hooks/useWsMessageOutbound";

type ToolTipExpandProps = {
  messageData: Message;
  eventOutboundTarget: EventOutboundTarget;
};

const ToolTipExpand: ForwardRefExoticComponent<
  RefAttributes<HTMLDivElement> & ToolTipExpandProps
> =
  // eslint-disable-next-line react/display-name
  forwardRef(
    ({ messageData, eventOutboundTarget }: ToolTipExpandProps, ref) => {
      const { deleteMessage } = useWsMessageOutbound();
      const handleDelete = () => {
        deleteMessage({
          messageId: messageData.id,
          target: eventOutboundTarget,
        });
      };
      return (
        <div
          ref={ref}
          className="z-20 flex flex-col bg-neutral-800 bg-opacity-60 border rounded-xl border-neutral-700"
        >
          <MenuItem>댓글에 대한 알림 끄기</MenuItem>
          <MenuItem>읽지 않음으로 표시</MenuItem>
          <MenuItem>이에 대한 리마인더 받기</MenuItem>
          <MenuItem>링크 복사</MenuItem>
          <MenuItem>채널에 고정</MenuItem>
          <MenuItem>메세지 편집</MenuItem>
          <MenuItem onClick={handleDelete}>
            <span className="text-red-700">메세지 삭제</span>
          </MenuItem>
          <MenuItem>메세지 바로 가기 추가...</MenuItem>
        </div>
      );
    }
  );

export default ToolTipExpand;
