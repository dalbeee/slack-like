import MenuItem from "@/common/components/MenuItem";
import { useRouter } from "next/router";

const ChannelCreateButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/client/${router.query.workspace as string}/browse-channels`);
  };
  return (
    <MenuItem className="flex items-center" onClick={handleClick}>
      <span className="material-symbols-outlined">add_box</span>
      채널 추가
    </MenuItem>
  );
};

export default ChannelCreateButton;
