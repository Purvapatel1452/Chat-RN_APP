// import React, {useEffect} from 'react';

// import {StripeProvider} from '@stripe/stripe-react-native';

// import {StyleSheet, Text, View} from 'react-native';

// import AppStack from './src/navigations/stack/AppStack';
// import {BASE_URL, STRIPE_KEY} from '@env';



// const App = () => {
//   console.log(BASE_URL,">gd5y>>fghjgef45guhtr6erg>>>",STRIPE_KEY);

//   return (
//     <StripeProvider publishableKey={STRIPE_KEY}>
//       <AppStack />
//     </StripeProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});



























import React, {useEffect} from 'react';

import {StripeProvider} from '@stripe/stripe-react-native';

import {Button, Platform, StyleSheet, Text, View} from 'react-native';

import AppStack from './src/navigations/stack/AppStack';
import {BASE_URL_AND, BASE_URL_IOS, STRIPE_KEY} from '@env';
import { requestUserPermission, getToken, showNotification } from './NotificationService';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';

console.log(BASE_URL_AND,"fdguheiruf",BASE_URL_IOS,"dsjkf")
export const BASE_URL=Platform.OS=='ios'?BASE_URL_IOS:BASE_URL_AND;

const App = () => {
  console.log(BASE_URL,">gd5y>>fghjgef45guhtr6erg>>>",STRIPE_KEY);

  // useEffect(() => {
  //   requestUserPermission();
  //   // getToken();

  //   // createNotificationChannel();

  //   // Handle foreground messages
  //   const unsubscribe = messaging().onMessage(async (remoteMessage:any) => {
  //     console.log('A new FCM message arrived!', remoteMessage);
  //     showNotification(remoteMessage.notification.token, remoteMessage.notification.title, remoteMessage.notification.body);
  //   });

  //   return unsubscribe;
  // }, []);

  // const sendTestNotification = () => {
  //   showNotification('Test Title', 'This is a test notification');
  // };

  return (
    <StripeProvider publishableKey={STRIPE_KEY}>
      <AppStack />
    </StripeProvider>
    // <View>
    //   <Text>HIII</Text>
    //   <Button title="Send Test Notification" onPress={sendTestNotification} />
    // </View>
  );
};

export default App;

const styles = StyleSheet.create({});
