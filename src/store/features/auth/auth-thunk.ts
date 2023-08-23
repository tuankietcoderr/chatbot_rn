import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, signIn, signOut, signUp } from "./auth-service";
import { IUser } from "@/schema/client/user";

const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    const response = await getCurrentUser();
    return response;
  }
);

const signUpThunk = createAsyncThunk("auth/signUp", async (user: IUser) => {
  const response = await signUp(user);
  return response;
});

const signInThunk = createAsyncThunk(
  "auth/signIn",
  async (data: { username: string; password: string }) => {
    const response = await signIn(data);
    return response;
  }
);

const signOutThunk = createAsyncThunk("auth/signOut", async () => {
  try {
    await signOut();
  } catch (err) {
    throw err;
  }
});

export { getCurrentUserThunk, signInThunk, signUpThunk, signOutThunk };