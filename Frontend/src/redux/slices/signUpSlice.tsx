import {BASE_URL} from '@env';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../../../NotificationService';

export const sendOtp: any = createAsyncThunk(
  'signUp/sendOtp',
  async (email, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'Zjfkrtggbgtrjhgut4rf54edetgbwetgtgrtdt@');
      const response = await axios.post(`${BASE_URL}/user/send-otp`, {email});
      console.log('*******', response);
      return response.data;
    } catch (error: any) {
      console.log('ERROR', error);
      return rejectWithValue(error.resposne.data.message);
    }
  },
);

export const verifyOtp: any = createAsyncThunk<any, any>(
  'signUp/verifyOtp',
  async ({email, otp}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, '!@jdrrtg5tgtfbhrefthbghgyurrrf5tterggfhrdei~');
      const response = await axios.post(`${BASE_URL}/user/verify-otp`, {
        email,
        otp,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.resposne.data.message);
    }
  },
);

export const registerUser: any = createAsyncThunk(
  'signUp/registerUser',
  async (userData, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'hgrft5tgbthefgfjthrfrtgfhyt%$');
      const response = await axios.post(`${BASE_URL}/user/register`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const signUpSlice = createSlice({
  name: 'signUp',
  initialState: {
    userData: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      otp: '',
      fcmToken:getToken()
    },
    nameVerify: false,
    emailVerify: false,
    mobileVerify: false,
    passwordVerify: false,
    otpVerify: false,
    showOtpInput: false,
    error: null,
    loading: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = {...state.userData, ...action.payload};
    },
    clearError: state => {
      state.error = null;
    },
    toggleShowOtpInput: state => {
      state.showOtpInput = !state.showOtpInput;
    },
    verifyFields: state => {
      const {name, email, mobile, password} = state.userData;

      state.nameVerify = name.length > 1;
      state.emailVerify = /^[\w.%+-]+@[\w,-]+\.[a-zA-Z]{1,}$/.test(email);
      state.mobileVerify = /[6-9]{1}[0-9]{9}/.test(mobile);
      state.passwordVerify = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(
        password,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, state => {
        state.loading = false;
        state.showOtpInput = true;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.loading = false;
        state.otpVerify = true;
        state.showOtpInput = false;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setUserData, clearError, toggleShowOtpInput, verifyFields} =
  signUpSlice.actions;
export default signUpSlice.reducer;
