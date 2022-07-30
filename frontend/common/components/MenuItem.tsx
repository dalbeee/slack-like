import React, { ComponentProps, FC, ReactNode } from "react";

type MenuItemProps = {
  children: ReactNode;
  onFocusBrighter?: boolean;
  onClick?: React.MouseEventHandler;
  value?: string;
  id?: string;
  isParent?: boolean;
};

const MenuItem: FC<ComponentProps<"div"> & MenuItemProps> = ({
  children,
  onFocusBrighter = true,
  onClick,
  isParent = false,
  className,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center w-full text-neutral-400 text-left text-lg p-1 text-ellipsis overflow-hidden truncate
        ${
          !isParent && onFocusBrighter
            ? "hover:cursor-pointer hover:bg-neutral-700"
            : ""
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        } ${className!}
      `}
      {...props}
    >
      {isParent && (
        <span className="material-symbols-outlined">expand_more</span>
      )}
      {children}
    </div>
  );
};

export default MenuItem;
