import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Workspace } from "@/common";
import { httpClient } from "@/common/httpClient";
import { RootState } from "@/common/store/store";
import {
  setCurrentWorkspace,
  setWorkspaces,
} from "@/common/store/workspaceSlice";

export const useFetchWorkspaces = () => {
  const { access_token } = useSelector((state: RootState) => state.user);
  const { workspaces } = useSelector((state: RootState) => state.workspaces);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const fetchWorkspace = useCallback(
    async (workspaceId: string) => {
      if (!user || !workspaceId) return;
      httpClient
        .get<any, Workspace>(`/workspaces`, {
          params: { id: workspaceId },
        })
        .then((r) => dispatch(setCurrentWorkspace(r.id)));
    },
    [dispatch, user]
  );

  const getWorkspaces = useCallback(() => {
    if (!access_token) return;
    httpClient
      .get<any, Workspace[]>("/workspaces", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((r) => dispatch(setWorkspaces(r)));
  }, [access_token, dispatch]);

  const fetchJoinedWorkspaces = useCallback(async () => {
    if (!user) return;
    httpClient
      .get<any, Workspace[]>(`/workspaces/joined-workspaces`)
      .then((r) => dispatch(setWorkspaces(r)));
  }, [dispatch, user]);

  useEffect(() => {
    getWorkspaces();
  }, [getWorkspaces]);

  return { workspaces, fetchJoinedWorkspaces, fetchWorkspace };
};
