import { ReactNode } from "react";

type MenuItemProps = { children: ReactNode; onFocusBrighter?: boolean };

const MenuItem = ({
  children,
  onFocusBrighter = true,
  ...props
}: MenuItemProps) => {
  return (
    <div
      className={`text-neutral-400 text-lg p-1 ${
        onFocusBrighter ? "hover:bg-neutral-700" : ""
      }`}
      {...props}
    >
      <button>
        <span>{children}</span>
      </button>
    </div>
  );
};

export default MenuItem;
