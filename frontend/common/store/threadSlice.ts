import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Message, MessageReaction } from "..";

const initialState = {
  thread: {} as Message,
};

export const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    // Message
    setThread: (state, action: PayloadAction<Message>) => {
      state.thread = action.payload;
    },

    appendComment: (state, action: PayloadAction<Message>) => {
      state.thread = {
        ...state.thread,
        comments: [...state.thread.comments, action.payload],
      };
    },

    deleteComment: (state, action: PayloadAction<Message>) => {
      state.thread = {
        ...state.thread,
        comments: state.thread.comments.filter(
          (comment) => comment.id !== action.payload.id
        ),
      };
    },

    // comment MessageReaction
    appendCommentReaction: (state, action: PayloadAction<MessageReaction>) => {
      const commentIndex = state.thread.comments.findIndex(
        (comment) => comment.id === action.payload.messageId
      );
      const comment = state.thread.comments[commentIndex];
      const updatedComment: Message = {
        ...comment,
        reactions: [
          ...comment.reactions.slice(0, commentIndex),
          action.payload,
          ...comment.reactions.slice(commentIndex + 1),
        ],
      };
      state.thread = {
        ...state.thread,
        comments: [
          ...state.thread.comments.slice(0, commentIndex),
          updatedComment,
          ...state.thread.comments.slice(commentIndex + 1),
        ],
      };
    },

    deleteMessageReaction: (state, action: PayloadAction<MessageReaction>) => {
      const commentIndex = state.thread.comments.findIndex(
        (comment) => comment.id === action.payload.messageId
      );
      const comment = state.thread.comments[commentIndex];
      const updatedComment: Message = {
        ...comment,
        reactions: comment.reactions.filter(
          (reaction) => reaction.id !== action.payload.id
        ),
      };
      state.thread = {
        ...state.thread,
        comments: [
          ...state.thread.comments.slice(0, commentIndex),
          updatedComment,
          ...state.thread.comments.slice(commentIndex + 1),
        ],
      };
    },
  },
});

export const {
  appendComment,
  appendCommentReaction,
  deleteComment,
  deleteMessageReaction,
} = threadSlice.actions;

export default threadSlice.reducer;
