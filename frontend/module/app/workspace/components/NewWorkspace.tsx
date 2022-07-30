import MenuItem from "@/common/components/MenuItem";

const NewWorkspace = () => {
  return (
    <div className="h-contentTitle flex">
      <MenuItem className="text-light text-2xl font-semibold">
        새 워크스페이스
        <button className="material-symbols-outlined">expand_more</button>
      </MenuItem>
    </div>
  );
};

export default NewWorkspace;
