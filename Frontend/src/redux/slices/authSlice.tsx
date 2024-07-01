import {BASE_URL_AND, BASE_URL_IOS} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {decode} from 'base-64';
import {Alert,Platform} from 'react-native';

interface AuthState {
  userId: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginResponse {
  userId: string;
  token: string;
}

interface UserData {
  email: string;
  password: string;
}

export const login: any = createAsyncThunk<any>(
  'auth/login',
  async (userData, {rejectWithValue}) => {
    try {
      console.log('LOGI');
      console.log(BASE_URL_AND,BASE_URL_IOS, ';jdrthsferurty6ol;ioyuyyioloiurtuyuir6efghrtg;ygh67uhfdhiyl');

      const response = await axios.post(`${Platform.OS=='ios'?BASE_URL_IOS:BASE_URL_AND}/user/login`, userData);

      const token = response.data.data;

      console.log(token, 'token');

      if (token) {
        const [_, payloadBase64, __] = token.split('.');
        const decodedPayload = decode(payloadBase64);
        const decodedToken = JSON.parse(decodedPayload);
        const userId = decodedToken.userId;

        await AsyncStorage.setItem('authToken', token);

        return {userId, token};
      }
    } catch (error: any) {
      console.log(error.response.data.message, '///////');
      Alert.alert('Login Error !!!', error.response.data.message.toString());
      return rejectWithValue(error.response.data.message);
    }
  },
);

const initialState: AuthState = {
  userId: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: state => {
      state.userId = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.userId = action.payload.userId;
          state.token = action.payload.token;
        },
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const {clearUser} = authSlice.actions;
export default authSlice.reducer;
