import { IData } from "./data";

export interface IQuestion {
  id?: string;
  question?: string;
  database?: IData[] | null;
  roomId?: string;
  dead?: boolean;
}
