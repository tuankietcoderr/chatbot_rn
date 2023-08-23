import { createAsyncThunk } from "@reduxjs/toolkit";
import { addSave, getSaves, removeSave } from "./save-service";
import { ISave } from "@/schema/client/save";

const getSavesThunk = createAsyncThunk("save/getSave", async () => {
  const response = await getSaves();
  return response;
});

const addSaveThunk = createAsyncThunk("save/addSave", async (save: ISave) => {
  const response = await addSave(save);
  return response;
});

const removeSaveThunk = createAsyncThunk(
  "save/removeSave",
  async (id: string) => {
    const response = await removeSave(id);
    return response;
  }
);

export { getSavesThunk, addSaveThunk, removeSaveThunk };
