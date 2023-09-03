export const API = {
  BASE: "https://chatbot-api.up.railway.app/api",
  USER: {
    BASE: "/user",
    SIGNIN: "/user/signin",
    SIGNUP: "/user/signup",
  },
  CHAT: {
    BASE: "/chat",
    SEND: "/chat/send",
  },
  ROOM: {
    BASE: "/room",
    CREATE: "/room/create",
  },
  SAVE: {
    BASE: "/save",
    ADD: "/save/add",
    REMOVE: "/save/remove",
    REMOVE_BY_MESSAGE_ID: "/save/remove/message",
  },
};

export const BOT = {
  BASE: "https://49da-116-110-40-86.ngrok-free.app/api",
  GET_ANSWER: "/get_answer",
};
