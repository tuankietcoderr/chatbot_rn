import { State } from "@/constants/state";
import { IRoom } from "@/schema/client/room";
import { createSlice } from "@reduxjs/toolkit";
import {
  createRoomThunk,
  deleteRoomThunk,
  getRoomsThunk,
  modifyRoomInfoThunk,
} from "./room-thunk";

interface IRoomState {
  rooms: IRoom[];
  status: State;
}

const initialState: IRoomState = {
  rooms: [],
  status: State.IDLE,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoomsThunk.pending, (state) => {
        state.status = State.LOADING;
      })
      .addCase(getRoomsThunk.fulfilled, (state, action) => {
        state.rooms = action.payload.data as IRoom[];
        state.status = State.IDLE;
      })
      .addCase(getRoomsThunk.rejected, (state) => {
        state.status = State.IDLE;
      });

    builder
      .addCase(createRoomThunk.pending, (state) => {})
      .addCase(createRoomThunk.fulfilled, (state, action) => {
        state.rooms = [action.payload.data, ...(state.rooms || [])];
      })
      .addCase(createRoomThunk.rejected, (state) => {});

    builder
      .addCase(modifyRoomInfoThunk.pending, (state) => {})
      .addCase(modifyRoomInfoThunk.fulfilled, (state, action) => {
        state.rooms = state.rooms?.map((room) =>
          room._id === action.payload.data._id ? action.payload.data : room
        );
      });

    builder
      .addCase(deleteRoomThunk.pending, (state) => {})
      .addCase(deleteRoomThunk.fulfilled, (state, action) => {
        state.rooms = state.rooms?.filter(
          (room) => room._id !== action.payload.data._id
        );
      })
      .addCase(deleteRoomThunk.rejected, (state) => {});
  },
});

export default roomSlice.reducer;

export const {} = roomSlice.actions;
