
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../App';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

// Thunk for fetching expense details
export const fetchExpense: any = createAsyncThunk(
  'expense/fetchExpense',
  async (expenseId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewdc dcysajdwugc dew');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/expense/expense/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const expenseData = response.data;

      // Set current user's payment status as paid
      const updatedPayments = expenseData.payments.map(
        (payment: {participant: {_id: any}}) => {
          if (payment.participant._id === expenseData.payerId._id) {
            return {...payment, paid: true};
          }
          return payment;
        },
      );

      return {...expenseData, payments: updatedPayments};
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Thunk for updating payment status
export const updatePaymentStatus: any = createAsyncThunk<any, any>(
  'expense/updatePaymentStatus',
  async ({expenseId, participantId, paid}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewfergy67fkdu56y87dygew');
      const token = await getToken();
      await axios.post(
        `${BASE_URL}/expense/paymentStatus`,
        {expenseId, participantId, paid},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return {participantId, paid};
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    expens: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch Expense
      .addCase(fetchExpense.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expens = action.payload;
      })
      .addCase(fetchExpense.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Payment Status
      .addCase(updatePaymentStatus.fulfilled, (state: any, action) => {
        if (state.expens) {
          state.expens.payments = state.expens.payments.map(
            (payment: {participant: {_id: any}}) =>
              payment.participant._id === action.payload.participantId
                ? {...payment, paid: action.payload.paid}
                : payment,
          );
        }
      });
  },
});

export default expenseSlice.reducer;
