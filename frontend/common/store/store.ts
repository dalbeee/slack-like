import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import userSlice from "./userSlice";
// import webSocketSlice from "./webSocketSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
    // webSocket: webSocketSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
