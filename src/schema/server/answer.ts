import { IReference } from "./reference";

export interface IAnswer {
  id: string;
  answer: string;
  ref: IReference;
  relatedTthc: string[];
  relatedQ: string[];
}
