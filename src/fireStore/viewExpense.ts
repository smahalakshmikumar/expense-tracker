import { collection, getDocs } from "firebase/firestore";
import db from "./fireStoreDB";

export const fetchExpenses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
};
