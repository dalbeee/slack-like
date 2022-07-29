import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Message } from "@/common";

const initialState = {
  messages: [] as Message[],
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    appendMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },

    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },

    resetMessageAll: (state) => {
      state.messages = initialState.messages;
    },
  },
});

export const { setMessages, appendMessage, deleteMessage, resetMessageAll } =
  messageSlice.actions;

export default messageSlice.reducer;
