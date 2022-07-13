import dayjs from "dayjs";

import { FetchData } from "@/common/types";
import ToolTip from "./ToolTip";

const Content = ({ data }: { data: FetchData }) => {
  if (!data) return null;

  return (
    <div className="h-full">
      {!!data?.Messages?.length &&
        data?.Messages.map((m) => (
          <div
            className="relative group hover:bg-neutral-700 hover:bg-opacity-50 py-2 justify-between flex"
            key={m.id}
          >
            <div className="">
              <span className="inline-block invisible text-neutral-400 group-hover:visible w-20 text-center text-sm ">
                {dayjs(m.createdAt).format("HH:mm")}
              </span>
              <span className="text-neutral-400 text-lg">{m.content}</span>
            </div>
            <div className="inline-block invisible absolute -right-0 -top-4 group-hover:visible">
              <ToolTip />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Content;
