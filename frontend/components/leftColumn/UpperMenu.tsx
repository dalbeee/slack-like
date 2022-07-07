import React from "react";

import MenuItem from "@/components/common/MenuItem";

const UpperMenu = () => {
  return (
    <div>
      <MenuItem>스레드</MenuItem>
      <MenuItem>멘션 및 반응</MenuItem>
      <MenuItem>저장된 항목</MenuItem>
      <MenuItem>Slack Connect</MenuItem>
      <MenuItem>더보기</MenuItem>
    </div>
  );
};

export default UpperMenu;
