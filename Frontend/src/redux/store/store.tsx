
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/usersSlice";
import authReducer from "../slices/authSlice";
import signUpReducer from "../slices/signUpSlice";
import groupReducer from "../slices/groupSlice";
import expensesReducer from "../slices/expensesSlice";
import friendReducer from "../slices/friendSlice";
import chatReducer from "../slices/chatSlice";
import recepientReducer from "../slices/recepientSlice";
import expenseReducer from "../slices/expenseSlice";
import paymentReducer from "../slices/paymentSlice";
import subscriptionReducer from "../slices/subscriptionSlice";

// Define the structure of the root state using TypeScript interfaces
interface AuthState {
  userId: string;
  token: string | null;
}

interface UsersState {
  details: any; // Replace 'any' with actual type of user details
  loading: boolean;
  error: string | null;
}

interface SignUpState {
  // Define the state structure for sign-up slice
}

interface GroupState {
  // Define the state structure for group slice
}

interface ExpensesState {
  // Define the state structure for expenses slice
}

interface FriendState {
  requestSent: boolean;
  loading: boolean;
  error: string | null;
}

interface ChatState {
  // Define the state structure for chat slice
}

interface RecepientState {
  // Define the state structure for recepient slice
}

interface ExpenseState {
  // Define the state structure for expense slice
}

interface PaymentState {
  // Define the state structure for payment slice
}




// Configure the Redux store with the root reducer and middleware
const store = configureStore({
  reducer: {
    auth: authReducer,
    signUp: signUpReducer,
    group: groupReducer,
    expenses: expensesReducer,
    expense: expenseReducer,
    friend: friendReducer,
    chat: chatReducer,
    recepient: recepientReducer,
    users: userReducer,
    payment: paymentReducer,
    sub:subscriptionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});


export type AppDispatch = typeof store.dispatch;

export default store;











