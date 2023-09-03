import { IReference } from "./reference";

export interface IAnswer {
  id: string;
  answer: string;
  ref: IReference[];
  related_tthc: string[];
  related_q: string[];
}
