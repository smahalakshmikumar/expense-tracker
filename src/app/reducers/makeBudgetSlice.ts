import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import db from "../../fireStore/fireStore";
import { MakeBudgetType } from "../components/MakeBudget";

export const addBudget = createAsyncThunk(
  "budget/makeBudget",
  async (budget: MakeBudgetType, thunkAPI) => {
    try {
      const docRef = await addDoc(
        collection(db, "budgets", budget.uid, "userBudgets"),
        budget
      );
      return { id: docRef.id, ...budget }; // Return the new budget with the Firebase ID
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchBudget = createAsyncThunk(
  "budget/fetchBudget",
  async (uid: MakeBudgetType['uid'], thunkAPI) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "budgets", uid, "userBudgets")
      );
      const budget: MakeBudgetType[] = [];
      querySnapshot.forEach((doc) => {
        budget.push({
          id: doc.id,
          ...doc.data(),
        } as unknown as MakeBudgetType); //to fix later
      });
      return budget;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

interface BudgetState {
  budget: MakeBudgetType[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BudgetState = {
  budget: [],
  loading: "idle",
  error: null,
};

const makeBudgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Budget
      .addCase(addBudget.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.budget.push(action.payload);
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      // Fetch Budget
      .addCase(fetchBudget.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.budget = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export default makeBudgetSlice.reducer;
