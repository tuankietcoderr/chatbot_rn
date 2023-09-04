import { IReference } from "../server/reference";

export interface IChatItem {
  _id?: string;
  roomId: string;
  reference?: IReference[];
  isSaved?: boolean;
  answer?: string;
  question?: string;
}
