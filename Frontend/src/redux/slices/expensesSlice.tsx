import {BASE_URL} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const addExpense: any = createAsyncThunk(
  'expense/addExpense',
  async (expenseData, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'eyd4tyhugwu3wdyrrwyhdt8efgew');
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/expense/addExpense`,
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchExpenses: any = createAsyncThunk<any, any>(
  'expense/fetchExpenses',
  async ({userId, expenseType, type}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewyjujdewdyhu7ygew');
      const token = await getToken();
      console.log(BASE_URL, '??bgtbtgrtfv');
      if (type !== undefined) {
        expenseType = '';
      }

      const response = await axios.get(
        `${BASE_URL}/expense/expenses/${userId}?expenseType=${expenseType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let list: any[] = [];
      if (type == 'settled') {
        response.data.expenses.map((expense: {settled: any}) => {
          if (expense.settled) {
            list.push(expense);
          }
        });
      } else {
        response.data.expenses.map((expense: any) => {
          list.push(expense);
        });
      }

      return list;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(addExpense.pending, state => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(addExpense.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExpenses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
  reducers: {},
});

export default expensesSlice.reducer;
