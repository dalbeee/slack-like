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
        ...state.messages.splice(0, index),
        updatedMessage,
        ...state.messages.splice(index),
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
        ...state.messages.splice(0, index),
        updatedMessage,
        ...state.messages.splice(index),
      ];
    },
  },
});

export const {
  setMessages,
  appendMessage,
  deleteMessage,
  resetMessageAll,
  appendMessageReaction,
  deleteMessageReaction,
} = messageSlice.actions;

export default messageSlice.reducer;
