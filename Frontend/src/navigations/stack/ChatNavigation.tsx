import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import HomeScreen from '../../screens/HomeScreen';
import FriendsScreen from '../../screens/FriendsScreen';
import ChatScreen from '../../screens/ChatScreen';
import ChatMessageScreen from '../../screens/ChatMessageScreen';
import ExpenseScreen from '../../screens/ExpenseScreen';
import ProfileScreen from '../../screens/ProfileScreen';

import UserProfileScreen from '../../screens/UserProfileScreen';

export type RootStackParamList = {
  Chats: undefined;
  Home: undefined;
  Friends: undefined;
  Messages: undefined;
  Expense: undefined;
  Profile: undefined;
  UserProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ChatNavigation: React.FC = () => {
  const userId = useSelector((state: any) => state.auth.userId);

  return (
    <Stack.Navigator
      initialRouteName="Chats"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Chats" component={ChatScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="Messages" component={ChatMessageScreen} />
      <Stack.Screen name="Expense" component={ExpenseScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigation;

const styles = StyleSheet.create({});
