import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Workspace } from "@/common";

const initialState = {
  workspaces: [] as Workspace[],
  currentWorkspaceId: "",
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspaceId = action.payload;
    },
  },
});

export const { setWorkspaces, setCurrentWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
