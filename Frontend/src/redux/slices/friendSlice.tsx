
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../App';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

// Fetch friends payment status
export const fetchFriendsPaymentStatus: any = createAsyncThunk(
  'chat/fetchFriendsPaymentStatus',
  async (userId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'eeftgyfewdyg5t7ew');
      const token = await getToken();
      const response = await fetch(
        `${BASE_URL}/user/friendsPaymentStatus/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch friends payment status');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch friend requests
export const fetchFriendRequests: any = createAsyncThunk(
  'friendRequests/fetchFriendRequests',
  async (userId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'eyyhwdrfg6yhrg');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/user/friend-request/${userId}`,
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

// Accept friend request
export const acceptFriendRequest: any = createAsyncThunk<any, any>(
  'friendRequest/acceptFriendRequest',
  async ({friendRequestId, userId}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewt5g6yhdyrjujftrg');
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/user/friend-request/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: friendRequestId,
          recepientId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      console.log(friendRequestId, ':::::1');
      return friendRequestId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Send friend request
export const sendFriendRequest: any = createAsyncThunk<any, any>(
  'friendRequest/sendFriendRequest',
  async ({currentUserId, selectedUserId}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewd3dfrr44yrfg3efew');
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/user/friend-request`,
        {
          currentUserId,
          selectedUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return selectedUserId;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Check if friend request is already sent
export const checkFriendRequest = createAsyncThunk<any, any>(
  'friendRequest/checkFriendRequest',
  async ({userId, item}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewedeffr3f34dygcrefeefrfwew');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/user/userDetails/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(
        response.data.sentFriendRequests,
        '::',
        item._id,
        '__',
        response.data.sentFriendRequests.includes(item._id),
      );
      return response.data.sentFriendRequests.includes(item._id);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    paymentStatus: [],
    friendRequests: [],
    requestSent: false,
    loading: false,
    error: null,
  },
  reducers: {
    setFriendRequests(state, action) {
      state.friendRequests = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFriendsPaymentStatus.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFriendsPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(fetchFriendsPaymentStatus.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFriendRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload.map((friendRequest: any) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
      })
      .addCase(fetchFriendRequests.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptFriendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = state.friendRequests.filter(
          (request: any) => request._id !== action.payload,
        );

        console.log(state.friendRequests, 'REQ');
      })
      .addCase(acceptFriendRequest.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendFriendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requestSent = true;
      })
      .addCase(sendFriendRequest.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkFriendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requestSent = action.payload;
      })
      .addCase(checkFriendRequest.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default friendSlice.reducer;
