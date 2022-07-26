/* eslint-disable security/detect-object-injection */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  AppState,
  Channel,
  ChannelData,
  ChannelMetadata,
  ChannelsHashMap,
  ChannelDataResponse,
  Message,
  SocketInfo,
  Workspace,
  WorkspacesHashMap,
} from "@/common";

const initialWorkspace: WorkspacesHashMap = {
  byId: [],
  byHash: {},
};

const initialChannel: ChannelsHashMap = {
  byId: [],
  byHash: {},
};

const initialState: AppState = {
  initialize: false,
  currentChannelData: {} as ChannelData,
  workspaces: {} as WorkspacesHashMap,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // workspaces
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      const workspaces = action.payload.reduce(
        (acc, workspace) => {
          acc.byId.push(workspace.id);
          acc.byHash[workspace.id] = {
            ...workspace,
            hasNewMessage: false,
            channels: initialChannel,
          };
          return acc;
        },
        { byId: [], byHash: {} } as WorkspacesHashMap
      );
      state.workspaces = workspaces;
      state.initialize = true;
    },

    // channels
    // currentChannelData
    //

    setChannels: (state, action: PayloadAction<ChannelDataResponse>) => {
      const { channels, workspaceId } = action.payload;
      const newChannelData = channels.reduce(
        (acc, channel) => {
          acc.byId.push(channel.id);
          acc.byHash[channel.id] = channel;
          return acc;
        },
        { byId: [], byHash: {} } as ChannelsHashMap
      );
      state.workspaces.byHash[workspaceId].channels = newChannelData;
      state.initialize = true;
    },

    appendChannelMetadata: (
      state,
      action: PayloadAction<{
        socketInfo: SocketInfo;
        metadata: ChannelMetadata;
      }>
    ) => {
      const setChannelMetadata = () => {
        const { metadata, socketInfo } = action.payload;
        const currentWorkspace =
          state.workspaces.byHash[socketInfo.workspaceId];
        if (!currentWorkspace?.channels?.byId.includes(socketInfo.channelId)) {
          currentWorkspace.channels.byId = [
            ...currentWorkspace.channels.byId,
            socketInfo.channelId,
          ];
        }
        currentWorkspace.channels.byHash[socketInfo.channelId] = {
          ...currentWorkspace.channels.byHash[socketInfo.channelId],
          ...metadata,
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
  setWorkspaces,
  appendChannelMetadata,
  setChannels,
  setCurrentChannelData,
  appendCurerntChannelData,
  deleteCurrentChannelData,
  resetCurrentChannelData,
} = appSlice.actions;

export default appSlice.reducer;
