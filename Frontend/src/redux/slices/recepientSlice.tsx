import {BASE_URL} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const fetchRecepientData: any = createAsyncThunk(
  'recepient/fetchRecepientData',
  async (recepientId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'KrtgfytazASgwed3Ky56ybhihgyuht5g7ujgrrg5edfytg');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/message/user/${recepientId}`,
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

export const fetchUserExpenses: any = createAsyncThunk<any, any>(
  'expenses/fetchUserExpenses',
  async ({userId, recepientId}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewefrtg56uWEDEctgtgtr6ukjhufrgdygeerrcfw');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/expense/userExpenses/${userId}/${recepientId}`,
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

const recepientSlice = createSlice({
  name: 'recepient',
  initialState: {
    recepientDatas: null,
    userExpense: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRecepientData.pending, state => {
        state.loading = true;
      })
      .addCase(fetchRecepientData.fulfilled, (state, action) => {
        state.loading = false;
        state.recepientDatas = action.payload;
      })
      .addCase(fetchRecepientData.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserExpenses.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUserExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.userExpense = action.payload;
      })
      .addCase(fetchUserExpenses.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recepientSlice.reducer;
