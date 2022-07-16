import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Channel, ChannelData, SocketMessage, SocketReaction } from "@/common";

export interface AppState {
  mention: boolean;
  bookmark: boolean;
  channels: (Channel & { alarm: boolean })[];
  currentChannelData: ChannelData;
}

const initialState: AppState = {
  bookmark: false,
  mention: false,
  channels: [] as (Channel & { alarm: boolean })[],
  currentChannelData: {} as ChannelData,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setReaction: (state, action: PayloadAction<SocketReaction>) => {
      switch (action.payload.data.target) {
        case "mention":
        case "bookmark":
          state[action.payload.data.target] = true;
          break;
        case "channel":
          return state;
      }
    },
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      const channels = action.payload.map((channel) => ({
        ...channel,
        alarm: false,
      }));
      state.channels = channels;
    },
    setCurrentChannelData: (state, action: PayloadAction<ChannelData>) => {
      state.currentChannelData = action.payload;
    },
    appendCurerntChannelData: (state, action: PayloadAction<SocketMessage>) => {
      if (
        state.currentChannelData.Messages.some(
          (message) => message.id === action.payload.data.id
        )
      )
        return state;
      state.currentChannelData = {
        ...state.currentChannelData,
        Messages: [...state.currentChannelData.Messages, action.payload.data],
      };
    },
    deleteCurrentChannelData: (state, action: PayloadAction<SocketMessage>) => {
      if (!state.currentChannelData.Messages) return state;
      state.currentChannelData = {
        ...state.currentChannelData,
        Messages: state.currentChannelData.Messages.filter(
          (message) => message.id !== action.payload.data.id
        ),
      };
    },
    resetCurrentChannelData: (state) => {
      state.currentChannelData = initialState.currentChannelData;
    },
  },
});

export const {
  setReaction,
  setChannels,
  setCurrentChannelData,
  appendCurerntChannelData,
  deleteCurrentChannelData,
  resetCurrentChannelData,
} = appSlice.actions;

export default appSlice.reducer;
