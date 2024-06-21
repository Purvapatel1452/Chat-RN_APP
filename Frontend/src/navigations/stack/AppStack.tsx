import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'base-64';

import {login} from '../../redux/slices/authSlice';
import AuthStack from './AuthStack';
import TabNavigator from '../tab/TabNavigation';

interface DecodedToken {
  userId: string;
}

const AppStack: React.FC = () => {
  const dispatch = useDispatch();
  const {userId, token} = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');

        if (storedToken) {
          const [_, payloadBase64, __] = storedToken.split('.');
          const decodedPayload = decode(payloadBase64) as string;
          const decodedToken = JSON.parse(decodedPayload) as DecodedToken;

          dispatch(
            login.fulfilled({userId: decodedToken.userId, token: storedToken}),
          );
        }
      } catch (err) {
        console.log('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token && userId ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
