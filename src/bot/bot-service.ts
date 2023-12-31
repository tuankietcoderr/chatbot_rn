import { IAnswer } from "@/schema/server/answer";
import { IQuestion } from "@/schema/server/question";
import axios from "axios";
import { botInstance } from "./api";
import { BOT } from "@/constants/api";

export const getAnswer = async ({
  database,
  question,
  dead,
  roomId,
}: IQuestion) => {
  try {
    const response = await botInstance.post(BOT.GET_ANSWER, {
      database: database || ["q", "tthc"],
      question,
      dead,
      roomId,
    });

    return response.data as IAnswer;
  } catch (error) {
    return error;
  }
};
