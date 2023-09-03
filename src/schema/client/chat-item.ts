import { IReference } from "../server/reference";

export interface IChatItem {
  _id?: string;
  content: string;
  roomId: string;
  isBotChat: boolean;
  reference?: IReference[];
  isSaved?: boolean;
}
