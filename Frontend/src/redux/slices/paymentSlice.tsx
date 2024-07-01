import {BASE_URL} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const fetchPaymentIntent: any = createAsyncThunk<any, any>(
  'payment/fetchPaymentIntent',
  async ({amount}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'Arfrcddrg56wfecfwdfrtgrMef54M');
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/payments/intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({amount}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      return data.paymentIntent;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createPaymentIntent: any = createAsyncThunk<any, any>(
  'payment/createPaymentIntent',
  async ({amount}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewcfdftwefygeeftrvrttrfw');
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/payments/intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({amount}),
      });

      const {client_secret} = await response.json();
      return client_secret;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const googlePaymentIntent:any = createAsyncThunk<any,any>(
  'payment/googlePaymentIntent',
  async ({amount}, { rejectWithValue }) => {
    try {
      console.log(BASE_URL, 'ewcfdftwefygeefrgrtytrvrttrfw');
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount}),
      });

      const { client_secret } = await response.json();
      return client_secret;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    loading: false,
    error: null,
    paymentIntentClientSecret: '',
    googlePaymentIntentClientSecret: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPaymentIntent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntentClientSecret = action.payload;
      })
      .addCase(fetchPaymentIntent.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPaymentIntent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntentClientSecret = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(googlePaymentIntent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googlePaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.googlePaymentIntentClientSecret = action.payload;
      })
      .addCase(googlePaymentIntent.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
  },
});

export default paymentSlice.reducer;
