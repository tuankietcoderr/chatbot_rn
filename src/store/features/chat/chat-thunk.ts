import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChatsOfRoom, sendChat } from "./chat-service";
import { IChatItem } from "@/schema/client/chat-item";

const getChatsOfRoomThunk = createAsyncThunk(
  "chat/getChatsOfRoom",
  async (roomId: string) => {
    const response = await getChatsOfRoom(roomId);
    return response;
  }
);

const sendChatThunk = createAsyncThunk(
  "chat/sendChat",
  async (chat: IChatItem) => {
    const response = await sendChat(chat);
    return response;
  }
);

export { getChatsOfRoomThunk, sendChatThunk };
