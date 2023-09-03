import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addSave,
  getSaves,
  removeSave,
  removeSaveByMessageId,
} from "./save-service";

const getSavesThunk = createAsyncThunk("save/getSave", async () => {
  const response = await getSaves();
  return response;
});

const addSaveThunk = createAsyncThunk(
  "save/addSave",
  async (chatId: string) => {
    const response = await addSave(chatId);
    return response;
  }
);

const removeSaveThunk = createAsyncThunk(
  "save/removeSave",
  async (id: string) => {
    const response = await removeSave(id);
    return response;
  }
);

const removeSaveByMessageIdThunk = createAsyncThunk(
  "save/removeSaveByMessageId",
  async (messageId: string) => {
    const response = await removeSaveByMessageId(messageId);
    return response;
  }
);

export {
  getSavesThunk,
  addSaveThunk,
  removeSaveThunk,
  removeSaveByMessageIdThunk,
};
