import {BASE_URL} from '@env';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../firebase/firebaseConfig';

interface stateType {
  messages: any[];
  loading: boolean;
  error: any;
}


export const fetchMessages: any = createAsyncThunk<any, any>(
  'chat/fetchMessages',
  async ({userId, recepientId,groupId}, {rejectWithValue}) => {
    try {
      let snapshot

      if(groupId){

        snapshot = await firebase.database().ref(`chats/${groupId}`).once('value');
    

      }else{
        const chatId = userId > recepientId ? `${userId}_${recepientId}` : `${recepientId}_${userId}`;
        snapshot = await firebase.database().ref(`chats/${chatId}`).once('value');
    

      }

      const messages = snapshot.val() ? Object.values(snapshot.val()) : [];
    
      return messages;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  }


);

export const sendMessage: any = createAsyncThunk<any, any>(
  'chat/sendMessage',
  async ({userId, recepientId, groupId, messageType, message,imageUrl}, {rejectWithValue}) => {
    try {
      let newMessageRef
      let newMessage

      if(groupId){
        newMessageRef = firebase.database().ref(`chats/${groupId}`).push();
        newMessage = {
          id: newMessageRef.key,
          senderId: userId,
          groupId,
          recepientId,
          message,
          imageUrl,
          messageType:messageType,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
      }
      }
      else{
        const chatId = userId > recepientId ? `${userId}_${recepientId}` : `${recepientId}_${userId}`;
        newMessageRef = firebase.database().ref(`chats/${chatId}`).push();

        newMessage = {
          id: newMessageRef.key,
          senderId: userId,
          recepientId,
          message,
          imageUrl,
          messageType:messageType,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
      }
      }
     
      await newMessageRef.set(newMessage);
      return newMessage;
    } catch (error:any) {
      return rejectWithValue(error.message);
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchMessages.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state: stateType, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, state => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state: stateType, action) => {
        state.loading = false;
        // state.messages.push(action.payload);
        if (!state.messages.find(msg => msg.id === action.payload.id)) {
          state.messages.push(action.payload);
        }

      })
      .addCase(sendMessage.rejected, (state: stateType, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
