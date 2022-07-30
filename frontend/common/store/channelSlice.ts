import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Channel,
  ChannelData,
  ChannelDataResponse,
  UpdateChannelMetadata,
} from "@/common";

const initialState: {
  subscribedChannels: ChannelData[];
  directMessageChannels: ChannelData[];
  currentChannel: ChannelData | null;
} = {
  subscribedChannels: [],
  directMessageChannels: [],
  currentChannel: null,
};

export const channelSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<ChannelDataResponse>) => {
      state.subscribedChannels = action.payload.channels;
    },

    setCurrentChannel: (state, action: PayloadAction<Channel>) => {
      state.currentChannel = action.payload;
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

    setDMChannels: (state, action: PayloadAction<Channel[]>) => {
      state.directMessageChannels = action.payload;
    },
  },
});

export const {
  setChannels,
  setCurrentChannel,
  updateChannelMetadata,
  setDMChannels,
} = channelSlice.actions;

export default channelSlice.reducer;
