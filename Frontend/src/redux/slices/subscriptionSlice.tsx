import {BASE_URL} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

// Async thunk for fetching user subscription
export const fetchUserSubscription: any = createAsyncThunk(
  'user/fetchSubscription',
  async (userId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'Zjfkrtggbgtrjf54hgutbwetgtfrrgrtdt@');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/user/getSubscription/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk for updating user subscription
export const updateUserSubscription: any = createAsyncThunk<any, any>(
  'user/updateSubscription',
  async ({userId, subscriptionType}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ervrdcrewvrwtwedgdyg45rfgew');
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/user/setSubscription`,
        {
          userId,
          subscriptionType,
        },
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

const subscriptionSlice = createSlice({
  name: 'sub',
  initialState: {
    subscription: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserSubscription.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchUserSubscription.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserSubscription.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(updateUserSubscription.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
