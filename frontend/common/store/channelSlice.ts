import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Channel,
  ChannelData,
  ChannelDataResponse,
  UpdateChannelMetadata,
} from "@/common";

const initialState: { subscribedChannels: ChannelData[] } = {
  subscribedChannels: [],
};

export const channelSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<ChannelDataResponse>) => {
      state.subscribedChannels = action.payload.channels;
    },

    appendChannel: (state, action: PayloadAction<Channel>) => {
      state.subscribedChannels = [...state.subscribedChannels, action.payload];
    },

    deleteChannel: (state, action: PayloadAction<Channel>) => {
      state.subscribedChannels = state.subscribedChannels.filter(
        (channel) => channel.id !== action.payload.id
      );
    },

    updateChannelMetadata: (
      state,
      action: PayloadAction<UpdateChannelMetadata>
    ) => {
      const {
        metadata,
        socketInfo: { channelId },
      } = action.payload;
      const channels = state.subscribedChannels.map((channel) => {
        if (channel.id === channelId) return { ...channel, ...metadata };
        else return channel;
      });
      state.subscribedChannels = channels;
    },
  },
});

export const {
  appendChannel,
  deleteChannel,
  setChannels,
  updateChannelMetadata,
} = channelSlice.actions;

export default channelSlice.reducer;
