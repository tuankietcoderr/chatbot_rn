import { deleteRequest, getRequest, postRequest } from "@/api/instance";
import { API } from "@/constants/api";
import { ISave } from "@/schema/client/save";

const getSaves = async () => {
  try {
    const response = await getRequest(API.SAVE.BASE);
    return response;
  } catch (err) {
    return err;
  }
};

const addSave = async (save: ISave) => {
  try {
    const response = await postRequest(API.SAVE.ADD, save);
    return response;
  } catch (err) {
    return err;
  }
};

const removeSave = async (id: string) => {
  try {
    const response = await deleteRequest(API.SAVE.REMOVE + "/" + id);
    return response;
  } catch (err) {
    return err;
  }
};

export { getSaves, addSave, removeSave };