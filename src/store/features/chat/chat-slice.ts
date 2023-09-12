import { State } from "@/constants/state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChatsOfRoomThunk, sendChatThunk } from "./chat-thunk";
import { IChatItem } from "@/schema/client/chat-item";

interface IChatState {
  chats: IChatItem[];
  status: State;
}

const initialState: IChatState = {
  chats: [],
  status: State.IDLE,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.chats = [];
    },
    afterAddSave: (state, action: PayloadAction<IChatItem>) => {
      state.chats = state.chats.map((chat) => {
        if (chat._id === action.payload._id) {
          return action.payload;
        }
        return chat;
      });
    },
    afterRemoveSave: (
      state,
      action: PayloadAction<{
        _id: string;
      }>
    ) => {
      state.chats = state.chats.map((chat) => {
        if (chat._id === action.payload._id) {
          return {
            ...chat,
            isSaved: false,
          };
        }
        return chat;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatsOfRoomThunk.pending, (state) => {
        state.status = State.LOADING;
      })
      .addCase(getChatsOfRoomThunk.fulfilled, (state, action) => {
        state.chats = action.payload.data;
        state.status = State.IDLE;
      })
      .addCase(getChatsOfRoomThunk.rejected, (state) => {
        state.status = State.IDLE;
      });

    builder
      .addCase(sendChatThunk.pending, (state) => {})
      .addCase(sendChatThunk.fulfilled, (state, action) => {
        state.chats = [...(state.chats || []), action.payload.data];
      })
      .addCase(sendChatThunk.rejected, (state) => {});
  },
});

export default chatSlice.reducer;

export const { afterAddSave, afterRemoveSave, resetChat } = chatSlice.actions;
