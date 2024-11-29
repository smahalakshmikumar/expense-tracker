import {
  signInWithPopup,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";
import { auth, provider } from "./config";

// Google Sign-In
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in: ", result.user);
    return result;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

// Sign-Out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
