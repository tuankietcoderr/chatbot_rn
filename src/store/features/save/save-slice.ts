import { State } from "@/constants/state";
import { ISave } from "@/schema/client/save";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addSaveThunk, getSavesThunk, removeSaveThunk } from "./save-thunk";

interface ISaveState {
  status: State;
  saves: ISave[];
}

const initialState: ISaveState = {
  status: State.IDLE,
  saves: [],
};

export const saveSlice = createSlice({
  name: "save",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSavesThunk.pending, (state) => {
        state.status = State.LOADING;
      })
      .addCase(getSavesThunk.fulfilled, (state, action) => {
        state.status = State.IDLE;
        state.saves = action.payload.data;
      })
      .addCase(getSavesThunk.rejected, (state) => {
        state.status = State.IDLE;
      });

    builder
      .addCase(addSaveThunk.pending, (state) => {})
      .addCase(addSaveThunk.fulfilled, (state, action) => {
        state.saves = [action.payload.data, ...state.saves];
      })
      .addCase(addSaveThunk.rejected, (state) => {});

    builder
      .addCase(removeSaveThunk.pending, (state) => {})
      .addCase(removeSaveThunk.fulfilled, (state, action) => {
        state.saves = state.saves.filter((save) => {
          return save._id !== action.payload.data._id;
        });
      })
      .addCase(removeSaveThunk.rejected, (state) => {});
  },
});

export const {} = saveSlice.actions;

export default saveSlice.reducer;
