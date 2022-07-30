import React from "react";

import MenuItem from "@/common/components/MenuItem";

const UpperMenu = () => {
  return (
    <div>
      <MenuItem>
        <span className="material-symbols-outlined">chat</span>
        스레드
      </MenuItem>
      <MenuItem>
        <span className="material-symbols-outlined">alternate_email</span>
        멘션 및 반응
      </MenuItem>
      <MenuItem>
        <span className="material-symbols-outlined">bookmark</span>
        저장된 항목
      </MenuItem>
      <MenuItem>
        <span className="material-symbols-outlined">location_city</span>
        Slack Connect
      </MenuItem>
      <MenuItem>
        <span className="material-symbols-outlined">menu</span>더보기
      </MenuItem>
    </div>
  );
};

export default UpperMenu;
