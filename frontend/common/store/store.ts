import { configureStore } from "@reduxjs/toolkit";

import channelSlice from "./channelSlice";
import messageSlice from "./messageSlice";
import threadSlice from "./threadSlice";
import userSlice from "./userSlice";
import workspaceSlice from "./workspaceSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    workspaces: workspaceSlice,
    channels: channelSlice,
    messages: messageSlice,
    thread: threadSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
