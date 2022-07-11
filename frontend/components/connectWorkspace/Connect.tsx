import { httpClient } from "@/common/httpClient";
import { Workspace } from "@/common/types";
import { useUser } from "@/user/hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Connect = () => {
  const router = useRouter();
  const { user } = useUser();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const getWorkspaces = () => {
      httpClient
        .get<any, Workspace[]>("/workspaces", {
          headers: { Authorization: `Bearer ${user.access_token as string}` },
        })
        .then((r) => setWorkspaces(r));
    };
    getWorkspaces();
  }, [user.access_token]);

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

export default Connect;
