import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, provider } from "../../config";

type AuthState = {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

//sign in with email password
export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || null,
        photoURL: result.user.photoURL || null,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to sign in via email");
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || null,
        photoURL: result.user.photoURL || null,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to register");
    }
  }
);

// Async thunk to sign in with Google
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, thunkAPI) => {
    try {
      const result = await signInWithPopup(auth, provider);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to sign in via gmail");
    }
  }
);

// Async thunk to sign out
export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, thunkAPI) => {
    try {
      await signOut(auth);
      return; // No data to return
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to sign out");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle Google Sign-In
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // Store user data in state
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Handle email Sign-In
    builder
    .addCase(signInWithEmail.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(signInWithEmail.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload; // Store user data in state
    })
    .addCase(signInWithEmail.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Handle email Sign-Up
    builder
      .addCase(registerWithEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // Store user data in state
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Handle Sign-Out
      .addCase(signOutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null; // Clear user data on sign-out
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
