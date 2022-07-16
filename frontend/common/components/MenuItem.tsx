import React, { ReactNode } from "react";

type MenuItemProps = {
  children: ReactNode;
  onFocusBrighter?: boolean;
  onClick?: React.MouseEventHandler;
  value?: string;
  id?: string;
  isParent?: boolean;
};

const MenuItem = ({
  children,
  onFocusBrighter = true,
  onClick,
  isParent = false,
  ...props
}: MenuItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`block w-full text-neutral-400 text-left text-lg p-1  
        ${
          !isParent && onFocusBrighter
            ? "hover:cursor-pointer hover:bg-neutral-700"
            : ""
        }
      `}
      {...props}
    >
      <span>{children}</span>
    </div>
  );
};

export default MenuItem;
