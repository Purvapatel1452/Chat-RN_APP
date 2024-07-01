import {BASE_URL, BASE_URL_AND, BASE_URL_IOS} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { confirmPlatformPaySetupIntent } from '@stripe/stripe-react-native';
import axios from 'axios';
import {Platform} from 'react-native'

const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const fetchUsers: any = createAsyncThunk(
  'users/fetchUsers',
  async (userId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, '{dsdcsdcjdertg67ty56uywer4tewfugdergewd');
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/user/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchUserDetails: any = createAsyncThunk(
  'profile/fetchUserDetails',
  async (userId, {rejectWithValue}) => {
    try {
      const token = await getToken();
      console.log(BASE_URL_IOS, 'II5thytuhjtht6ughy7yDbu7uDD');
      console.log(token, 'User ID');

      const response = await fetch(`${Platform.OS=='ios'?BASE_URL_IOS:BASE_URL_AND}/user/userDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({userId}),
      });
      console.log("RESPO",response)

      if (!response.ok) {
      
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching user details:', error);
     
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserProfile: any = createAsyncThunk<any, any>(
  'user/updateProfile',
  async ({userId, name, mobile}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, '{kdfvsdcthurj65g7xewhecwd');
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/user/editProfile`,
        {
          userId,
          name,
          mobile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteUserAccount: any = createAsyncThunk<any, any>(
  'users/deleteUserAccount',
  async ({userId}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, '{dcrefcjthy64ygexewfdeefwkjcdcghd');
      const token = await getToken();
      const response = await axios.delete(
        `${BASE_URL}/user/deleteUser/${userId}`,
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

export const recoverUserAccount = createAsyncThunk<any, any>(
  'users/recoverUserAccount',
  async ({email, password}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, '{dcefwsrthy7ucdewfdfrfiuy8');
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/recoverUser`,
        {email, password},
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

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    details: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.details = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
