import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import ExpenseScreen from '../../screens/ExpenseScreen';
import ExpensesScreen from '../../screens/ExpensesScreen';
import ProfileScreen from '../../screens/ProfileScreen';

export type ExpenseStackParamList = {
  Expenses: undefined;
  Expense: undefined;
  Profile: undefined;
};

interface RootState {
  auth: {
    userId: string;
  };
}

const Stack = createNativeStackNavigator<ExpenseStackParamList>();

const ExpenseNavigation: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
      <Stack.Screen name="Expense" component={ExpenseScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ExpenseNavigation;

const styles = StyleSheet.create({});
