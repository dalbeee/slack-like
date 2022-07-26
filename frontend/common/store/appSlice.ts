import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Channel,
  ChannelData,
  ChannelMetadata,
  ChannelsHashMap,
  HttpChannelMetadataResponse,
  Message,
  SocketInfo,
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
    appendChannelMetadata: (
      state,
      action: PayloadAction<{
        socketInfo: SocketInfo;
        metadata: ChannelMetadata;
      }>
    ) => {
      const setChannelMetadata = () => {
        if (
          !state.channels.byId.includes(action.payload.socketInfo.channelId)
        ) {
          state.channels.byId = [
            ...state.channels.byId,
            action.payload.socketInfo.channelId,
          ];
        }
        state.channels.byHash[action.payload.socketInfo.channelId] = {
          ...state.channels.byHash[action.payload.socketInfo.channelId],
          ...action.payload.metadata,
        };
      };
      setChannelMetadata();
    },
    setCurrentChannelData: (state, action: PayloadAction<ChannelData>) => {
      state.currentChannelData = action.payload;
    },
    appendCurerntChannelData: (state, action: PayloadAction<Message>) => {
      if (
        state.currentChannelData.Messages.some(
          (message) => message.id === action.payload.id
        )
      )
        return state;
      state.currentChannelData = {
        ...state.currentChannelData,
        Messages: [...state.currentChannelData.Messages, action.payload],
      };
    },
    deleteCurrentChannelData: (state, action: PayloadAction<string>) => {
      if (!state.currentChannelData.Messages) return state;
      state.currentChannelData = {
        ...state.currentChannelData,
        Messages: state.currentChannelData.Messages.filter(
          (message) => message.id !== action.payload
        ),
      };
    },
    resetCurrentChannelData: (state) => {
      state.currentChannelData = initialState.currentChannelData;
    },
  },
});

export const {
  appendChannelMetadata,
  setChannels,
  setCurrentChannelData,
  appendCurerntChannelData,
  deleteCurrentChannelData,
  resetCurrentChannelData,
  setChannelsMetadata,
} = appSlice.actions;

export default appSlice.reducer;
