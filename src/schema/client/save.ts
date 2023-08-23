import { IChatItem } from "./chat-item";

export interface ISave {
  _id?: string;
  userId?: string;
  roomId?: string;
  createdAt?: string;
  chat: IChatItem;
}
