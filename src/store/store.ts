import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/auth-slice";
import { roomSlice } from "./features/room/room-slice";
import { chatSlice } from "./features/chat/chat-slice";
import { saveSlice } from "./features/save/save-slice";
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    room: roomSlice.reducer,
    chat: chatSlice.reducer,
    save: saveSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
