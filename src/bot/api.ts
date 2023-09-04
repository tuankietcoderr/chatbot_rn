import { BOT } from "@/constants/api";
import axios from "axios";

export const botInstance = axios.create({
  baseURL: BOT.BASE,
  timeout: 20000,
});
