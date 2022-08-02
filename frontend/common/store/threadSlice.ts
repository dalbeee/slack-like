import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Message, MessageReaction } from "..";

const initialState = {
  thread: {} as Message,
  curentThreadId: "",
};

export const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    // Message
    setThread: (state, action: PayloadAction<Message>) => {
      state.thread = action.payload;
    },

    setCurrentThreadId: (state, action: PayloadAction<string>) => {
      state.curentThreadId = action.payload;
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
        reactions: [...comment.reactions, action.payload],
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

    deleteCommentReaction: (state, action: PayloadAction<MessageReaction>) => {
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
  setThread,
  setCurrentThreadId,
  appendComment,
  appendCommentReaction,
  deleteComment,
  deleteCommentReaction,
} = threadSlice.actions;

export default threadSlice.reducer;
