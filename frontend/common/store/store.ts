import { configureStore } from "@reduxjs/toolkit";

import channelSlice from "./channelSlice";
import messageSlice from "./messageSlice";
import userSlice from "./userSlice";
import workspaceSlice from "./workspaceSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    workspaces: workspaceSlice,
    messages: messageSlice,
    channels: channelSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
