import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Workspace } from "@/common";
import { httpClient } from "@/common/httpClient";
import { setWorkspaces } from "@/common/store/appSlice";

export const useFetchJoinedWorkspaces = () => {
  const dispatch = useDispatch();

  const fetchJoinedWorkspaces = useCallback(async () => {
    httpClient
      .get<any, Workspace[]>(`/users/joined-workspaces`)
      .then(async (r) => {
        dispatch(setWorkspaces(r));
        return;
      });
  }, [dispatch]);

  return { fetchJoinedWorkspaces };
};
