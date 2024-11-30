import { collection, addDoc } from "firebase/firestore";
import db from "./fireStoreDB";

export const addExpense = async (expense: {
  date: string;
  description: string;
  amount: number;
}) => {
  try {
    const docRef = await addDoc(collection(db, "expenses"), expense);
    console.log("Expense added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};
