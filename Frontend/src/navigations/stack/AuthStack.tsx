import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../../screens/Login';
import SignUp from '../../screens/SignUp';
import RecoverScreen from '../../screens/RecoverScreen';

interface AuthStackProps {}

const Stack = createNativeStackNavigator();

const AuthStack: React.FC<AuthStackProps> = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Recover"
        component={RecoverScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
