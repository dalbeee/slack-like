import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/common/types";

export interface userState {
  user?: User;
  access_token?: string;
}

const initialState: userState = {
  user: undefined,
  access_token: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
  },
});

export const { setUser, setAccessToken } = userSlice.actions;

export default userSlice.reducer;
