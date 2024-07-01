import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const fetchGroups: any = createAsyncThunk(
  'group/fetchGroups',
  async (userId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'erf4edwf5wfgty4drfyrfregew');
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/group/groups/${userId}`, {
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

export const createGroup: any = createAsyncThunk(
  'group/createGroup',
  async (groupData, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'e5gtferftg6yu7gwdygergfvretgw');
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/group/createGroup`,
        groupData,
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

export const fetchFriends: any = createAsyncThunk(
  'groups/fetchFriends',
  async (userId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewfvdrg4gtrdyfergew');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/user/accepted-friends/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const fetchGroupExpenses: any = createAsyncThunk(
  'expense/fetchGroupExpenses',
  async (groupId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewfcedyg5g45fcrtew');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/expense/groupExpenses/${groupId}`,
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

export const fetchGroupData: any = createAsyncThunk(
  'group/fetchGroupData',
  async (groupId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewgtre6gdg4ygrfefew');
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/message/group/${groupId}`, {
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

export const fetchGroupPaymentStatus: any = createAsyncThunk(
  'group/fetchGroupPaymentStatus',
  async (userId, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'ewdcredygerfgtgtggcref45ew');
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/group/groupPaymentStatus/${userId}`,
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

export const editGroup: any = createAsyncThunk<any, any>(
  'group/editGroup',
  async ({groupId, groupData, userId}, {rejectWithValue}) => {
    try {
      console.log(BASE_URL, 'eecref4wdygfreefew');
      const token = await getToken();
      const response = await axios.put(
        `${BASE_URL}/group/editGroup/${groupId}`,
        {
          ...groupData,
          adminId: userId,
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

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    friends: [],
    groupExpenses: [],
    groupPaymentStatus: [],
    groupData: null,
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGroups.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGroup.pending, state => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state: any, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFriends.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGroupExpenses.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGroupExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.groupExpenses = action.payload;
      })
      .addCase(fetchGroupExpenses.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGroupData.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGroupData.fulfilled, (state, action) => {
        state.loading = false;
        state.groupData = action.payload;
      })
      .addCase(fetchGroupData.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGroupPaymentStatus.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGroupPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.groupPaymentStatus = action.payload;
      })
      .addCase(fetchGroupPaymentStatus.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editGroup.pending, state => {
        state.loading = true;
      })
      .addCase(editGroup.fulfilled, (state: any, action) => {
        state.loading = false;
        const index = state.groups.findIndex(
          (group: any) => group._id === action.payload._id,
        );
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(editGroup.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
  reducers: {},
});

export default groupSlice.reducer;
