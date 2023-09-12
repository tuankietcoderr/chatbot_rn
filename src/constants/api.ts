export const API = {
  BASE: "https://chatbot-api.up.railway.app/api",
  USER: {
    BASE: "/user",
    SIGNIN: "/user/signin",
    SIGNUP: "/user/signup",
    FORGOT_PASSWORD: "/user/forgot-password",
    SEND_EMAIL: "/user/send-email",
    CHANGE_PASSWORD: "/user/change-password",
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
  BASE: "https://mutually-knowing-bull.ngrok-free.app/api",
  GET_ANSWER: "/get_answer",
};
