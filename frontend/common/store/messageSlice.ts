import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Message, MessageReaction } from "@/common";

const initialState = {
  messages: [] as Message[],
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // Message
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    appendMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },

    deleteMessage: (state, action: PayloadAction<Message>) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload.id
      );
    },

    updateMessageCommentsCount: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.id
      );
      const message = state.messages[index];
      const updatedMessage: Message = {
        ...message,
        commentsCount: action.payload.commentsCount,
      };
      state.messages = [
        ...state.messages.slice(0, index),
        updatedMessage,
        ...state.messages.slice(index + 1),
      ];
    },

    resetMessageAll: (state) => {
      state.messages = initialState.messages;
    },

    // MessageReaction
    appendMessageReaction: (state, action: PayloadAction<MessageReaction>) => {
      const index = state.messages.findIndex(
        (i) => i.id === action.payload.messageId
      );
      const message = state.messages[index];
      const updatedMessage: Message = {
        ...message,
        reactions: [...message.reactions, action.payload],
      };
      state.messages = [
        ...state.messages.slice(0, index),
        updatedMessage,
        ...state.messages.slice(index + 1),
      ];
    },

    deleteMessageReaction: (state, action: PayloadAction<MessageReaction>) => {
      const index = state.messages.findIndex(
        (i) => i.id === action.payload.messageId
      );
      const updatedMessage: Message = {
        ...state.messages[index],
        reactions: [
          ...state.messages[index].reactions.filter(
            (i) => i.id !== action.payload.id
          ),
        ],
      };
      state.messages = [
        ...state.messages.slice(0, index),
        updatedMessage,
        ...state.messages.slice(index + 1),
      ];
    },
  },
});

export const {
  setMessages,
  appendMessage,
  deleteMessage,
  updateMessageCommentsCount,
  resetMessageAll,
  appendMessageReaction,
  deleteMessageReaction,
} = messageSlice.actions;

export default messageSlice.reducer;
