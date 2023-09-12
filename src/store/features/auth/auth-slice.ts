import { State } from "@constants/state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getCurrentUserThunk,
  signInThunk,
  signOutThunk,
  signUpThunk,
  updateUserThunk,
} from "./auth-thunk";
import { IUser } from "@/schema/client/user";

export interface AuthState {
  user?: IUser;
  status?: State;
  isLogged?: boolean;
}

const initialState: AuthState = {
  status: State.IDLE,
  isLogged: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.status = State.LOADING;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.status = State.IDLE;
        state.isLogged = true;
      })
      .addCase(getCurrentUserThunk.rejected, (state) => {
        state.status = State.IDLE;
      });

    builder
      .addCase(signInThunk.pending, (state) => {
        state.status = State.LOADING;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.status = State.IDLE;
        state.isLogged = true;
      })
      .addCase(signInThunk.rejected, (state) => {
        state.status = State.IDLE;
      });

    builder
      .addCase(signUpThunk.pending, (state) => {
        state.status = State.LOADING;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = State.IDLE;
      })
      .addCase(signUpThunk.rejected, (state) => {
        state.status = State.IDLE;
      });

    builder
      .addCase(signOutThunk.pending, (state) => {})
      .addCase(signOutThunk.fulfilled, (state) => {
        state.user = undefined;
        state.isLogged = false;
      })
      .addCase(signOutThunk.rejected, (state) => {});

    builder
      .addCase(updateUserThunk.pending, (state) => {})
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addCase(updateUserThunk.rejected, (state) => {});
  },
});

export default authSlice.reducer;

export const {} = authSlice.actions;
