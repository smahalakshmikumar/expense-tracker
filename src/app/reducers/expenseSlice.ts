import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import db from "../../fireStore/fireStoreDB";
import { AddExpenseType } from "../components/AddExpense";

// Add an expense to Firebase
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expense: AddExpenseType, thunkAPI) => {
    try {
      const sanitizedExpense = {
        ...expense,
        expenseAmount: Number(expense.expenseAmount), // Force it to be a number
      };
      const docRef = await addDoc(
        collection(db, "expenses", expense.uid, "userExpenses"),
        sanitizedExpense
      );
      return { id: docRef.id, sanitizedExpense }; // Return the new expense with the Firebase ID
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to add expense");
    }
  }
);

// Fetch all expenses
export const fetchAllExpenses = createAsyncThunk(
  "expenses/fetchAllExpenses",
  async (uid: AddExpenseType["uid"], thunkAPI) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "expenses", uid, "userExpenses")
      );
      const expenses: AddExpenseType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        expenses.push({ id: doc.id, ...(data as AddExpenseType) });
      });
      return expenses; // Return all expenses
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch all expenses"
      );
    }
  }
);

// Define the initial state
interface ExpenseState {
  expensesByBudget: { [budgetId: string]: AddExpenseType[] };
  allExpenses: AddExpenseType[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExpenseState = {
  expensesByBudget: {},
  allExpenses: [],
  loading: "idle",
  error: null,
};

// Create the expense slice
const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add expense
      .addCase(addExpense.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        const { ...expense } = action.payload;
        state.loading = "succeeded";
        state.allExpenses.push(expense.sanitizedExpense);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      // Fetch all expenses
      .addCase(fetchAllExpenses.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.allExpenses = action.payload;
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export default expenseSlice.reducer;
