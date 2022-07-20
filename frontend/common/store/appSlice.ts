import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Channel,
  ChannelData,
  ChannelsHashMap,
  HttpChannelMetadataResponse,
  SocketMessageCreate,
  SocketMessageDelete,
  SocketReactionData,
} from "@/common";

export interface AppState {
  initialize: boolean;
  mention: boolean;
  bookmark: boolean;
  channels: ChannelsHashMap;
  currentChannelData: ChannelData;
}

const initialState: AppState = {
  initialize: false,
  bookmark: false,
  mention: false,
  channels: { byId: [], byHash: {} } as ChannelsHashMap,
  currentChannelData: {} as ChannelData,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      const channels = action.payload.reduce(
        (acc, v) => {
          acc.byId.push(v.id);
          acc.byHash[v.id] = v;
          return acc;
        },
        { byId: [], byHash: {} } as ChannelsHashMap
      );
      state.channels = channels;
      state.initialize = true;
    },
    setChannelsMetadata: (
      state,
      action: PayloadAction<HttpChannelMetadataResponse>
    ) => {
      Object.keys(action.payload).forEach((key) => {
        state.channels.byHash[key] = {
          ...state.channels.byHash[key],
          ...action.payload[key],
        };
      });
    },
    setReaction: (state, action: PayloadAction<SocketReactionData>) => {
      const setChannelMetadata = () => {
        if (!state.channels.byId.includes(action.payload.channelId)) {
          state.channels.byId = [
            ...state.channels.byId,
            action.payload.channelId,
          ];
        }
        state.channels.byHash[action.payload.channelId] = {
          ...state.channels.byHash[action.payload.channelId],
          ...action.payload.data,
        };
      };
      setChannelMetadata();
    },
    setCurrentChannelData: (state, action: PayloadAction<ChannelData>) => {
      state.currentChannelData = action.payload;
    },
    appendCurerntChannelData: (
      state,
      action: PayloadAction<SocketMessageCreate>
    ) => {
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
    deleteCurrentChannelData: (
      state,
      action: PayloadAction<SocketMessageDelete>
    ) => {
      if (!state.currentChannelData.Messages) return state;
      state.currentChannelData = {
        ...state.currentChannelData,
        Messages: state.currentChannelData.Messages.filter(
          (message) => message.id !== action.payload.data.messageId
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
  setChannelsMetadata,
} = appSlice.actions;

export default appSlice.reducer;
