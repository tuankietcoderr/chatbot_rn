import { getRequest, postRequest } from "@/api/instance";
import { API } from "@/constants/api";
import { IChatItem } from "@/schema/client/chat-item";

const getChatsOfRoom = async (roomId: string) => {
  try {
    const response = await getRequest(API.CHAT.BASE + "?" + "roomId=" + roomId);
    return response;
  } catch (err) {
    return err;
  }
};

const sendChat = async (chat: IChatItem) => {
  try {
    const response = await postRequest(API.CHAT.SEND, chat);
    return response;
  } catch (err) {
    return err;
  }
};

export { getChatsOfRoom, sendChat };
