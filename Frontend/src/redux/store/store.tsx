
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











