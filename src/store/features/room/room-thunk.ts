import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRoom,
  deleteRoom,
  getRooms,
  modifyRoomInfo,
} from "./room-service";
import { IRoom } from "@/schema/client/room";

const getRoomsThunk = createAsyncThunk("room/getRooms", async () => {
  const response = await getRooms();
  return response;
});

const createRoomThunk = createAsyncThunk(
  "room/createRoom",
  async (room: IRoom) => {
    const response = await createRoom(room);
    return response;
  }
);

const modifyRoomInfoThunk = createAsyncThunk(
  "room/modifyRoomInfo",
  async (room: IRoom) => {
    const response = await modifyRoomInfo(room);
    return response;
  }
);

const deleteRoomThunk = createAsyncThunk(
  "room/deleteRoom",
  async (roomId: string) => {
    const response = await deleteRoom(roomId);
    return response;
  }
);

export { getRoomsThunk, createRoomThunk, modifyRoomInfoThunk, deleteRoomThunk };
