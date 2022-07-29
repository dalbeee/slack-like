import { useRouter } from "next/router";

import { Workspace } from "@/common";
import { useFetchWorkspaces } from "../hooks/useFetchWorkspaces";

const WorkspaceConnector = () => {
  const router = useRouter();
  const { workspaces } = useFetchWorkspaces();

  const handleClick = (workspace: Workspace) => {
    router.push(`/client/${workspace.id}`);
    return;
  };

  return (
    <div className="min-h-content flex justify-center items-center flex-col">
      <span className="text-4xl pb-10 text-neutral-600 font-bold">
        내 워크스페이스
      </span>
      {workspaces?.map((workspace) => (
        <button
          key={workspace.id}
          className="py-4"
          onClick={() => handleClick(workspace)}
        >
          <span className="text-2xl">{workspace.name}</span>
        </button>
      ))}
    </div>
  );
};

export default WorkspaceConnector;
