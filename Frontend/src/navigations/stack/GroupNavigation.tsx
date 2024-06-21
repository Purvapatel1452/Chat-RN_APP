import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import GroupScreen from '../../screens/GroupScreen';
import ExpensesScreen from '../../screens/ExpensesScreen';
import GroupChatScreen from '../../screens/GroupChatScreen';
import ExpenseScreen from '../../screens/ExpenseScreen';
import ProfileScreen from '../../screens/ProfileScreen';

import ChatProfileScreen from '../../screens/ChatProfileScreen';

export type GroupStackParamList = {
  GroupScreen: undefined;
  GroupChat: undefined;
  Expenses: undefined;
  Expense: undefined;
  Profile: undefined;
  GroupChatProfile: undefined;
};

const Stack = createNativeStackNavigator<GroupStackParamList>();

const GroupNavigation: React.FC = () => {
  const userId = useSelector((state: any) => state.auth.userId);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="GroupScreen" component={GroupScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
      <Stack.Screen name="Expense" component={ExpenseScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="GroupChatProfile" component={ChatProfileScreen} />
    </Stack.Navigator>
  );
};

export default GroupNavigation;

const styles = StyleSheet.create({});
