import { selectAuth } from "@/store/features/auth/auth-selector";
import { getCurrentUserThunk } from "@/store/features/auth/auth-thunk";
import { getRoomsThunk } from "@/store/features/room/room-thunk";
import { getSavesThunk } from "@/store/features/save/save-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import React, { createContext, useEffect } from "react";

export const DataContext = createContext({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isLogged, user, status } = useAppSelector(selectAuth);
  useEffect(() => {
    if (isLogged) {
      if (!user) {
        dispatch(getCurrentUserThunk());
      }
      // dispatch all data
      (async function () {
        Promise.all([dispatch(getRoomsThunk()), dispatch(getSavesThunk())]);
      })();
    }
  }, [isLogged, user, status]);
  const value = {};
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
