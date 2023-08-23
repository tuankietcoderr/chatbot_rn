import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/api/instance";
import { API } from "@/constants/api";
import { IRoom } from "@/schema/client/room";

const getRooms = async () => {
  try {
    const response = await getRequest(API.ROOM.BASE);
    return response;
  } catch (err) {
    return err;
  }
};

const createRoom = async (room: IRoom) => {
  try {
    const response = await postRequest(API.ROOM.CREATE, room);
    return response;
  } catch (err) {
    return err;
  }
};

const modifyRoomInfo = async (room: IRoom) => {
  try {
    const response = await putRequest(API.ROOM.BASE + "/" + room._id, room);
    return response;
  } catch (err) {
    return err;
  }
};

const deleteRoom = async (roomId: string) => {
  try {
    const response = await deleteRequest(API.ROOM.BASE + "/" + roomId);
    return response;
  } catch (err) {
    return err;
  }
};

export { getRooms, createRoom, modifyRoomInfo, deleteRoom };
