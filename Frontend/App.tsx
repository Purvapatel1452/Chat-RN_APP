import React, {useEffect} from 'react';

import {StripeProvider} from '@stripe/stripe-react-native';

import {StyleSheet, Text, View} from 'react-native';

import AppStack from './src/navigations/stack/AppStack';
import {BASE_URL, STRIPE_KEY} from '@env';



const App = () => {
  console.log(BASE_URL,">gd5y>>fghjgef45guhtr6erg>>>",STRIPE_KEY);

  return (
    <StripeProvider publishableKey={STRIPE_KEY}>
      <AppStack />
    </StripeProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
