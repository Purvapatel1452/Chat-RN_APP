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



























// import React, {useEffect} from 'react';

// import {StripeProvider} from '@stripe/stripe-react-native';

// import {Button, NativeModules, Platform, StyleSheet, Text, View} from 'react-native';

// import AppStack from './src/navigations/stack/AppStack';
// import {BASE_URL_AND, BASE_URL_IOS, STRIPE_KEY} from '@env';

// const {CalendarModule} =NativeModules

// console.log(CalendarModule,"MODULEee",NativeModules)



// console.log(BASE_URL_AND,"fdguheiruf",BASE_URL_IOS,"dsjkf")
// export const BASE_URL=Platform.OS=='ios'?BASE_URL_IOS:BASE_URL_AND;

// const App = () => {
//   console.log(BASE_URL,">gd5y>>fghjgef45guhtr6erg>>>",STRIPE_KEY);
// const onPress=()=>{
//   console.log("PRESSED")
 
//     console.log(CalendarModule.addEvent,"console")
//   // CalendarModule.createCalendarEvent("EVENT","Event called",eventId => {
//   //   console.log(`Created a new event with id ${eventId}`);
//   // },)
//   CalendarModule.addEvent("EVENT","Event called")
//   // CalendarModule.createCalendarEvent((res:any)=>console.log(res,"RESPONSEE"))
// //  const res=await CalendarModule.createCalendarPromise()
//   // console.log("RESPONSE",res)

// }
//   // useEffect(() => {
//   //   requestUserPermission();
//   //   // getToken();

//   //   // createNotificationChannel();

//   //   // Handle foreground messages
//   //   const unsubscribe = messaging().onMessage(async (remoteMessage:any) => {
//   //     console.log('A new FCM message arrived!', remoteMessage);
//   //     showNotification(remoteMessage.notification.token, remoteMessage.notification.title, remoteMessage.notification.body);
//   //   });

//   //   return unsubscribe;
//   // }, []);

//   // const sendTestNotification = () => {
//   //   showNotification('Test Title', 'This is a test notification');
//   // };

//   return (
//     // <StripeProvider publishableKey={STRIPE_KEY}>
//     //   <AppStack />
//     // </StripeProvider>
//     <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
//       <View><Text>Native Module Event</Text></View>
//       <Button title="Event Trigger"  onPress={()=>onPress()} />
//     </View>
   
//   );
// };

// export default App;

// const styles = StyleSheet.create({});




























import React, {useEffect} from 'react';

import {StripeProvider} from '@stripe/stripe-react-native';

import {Button, NativeModules, Platform, StyleSheet, Text, View} from 'react-native';

import AppStack from './src/navigations/stack/AppStack';
import {BASE_URL_AND, BASE_URL_IOS, STRIPE_KEY} from '@env';

const {CalendarModule} =NativeModules

console.log(CalendarModule,"MODULEee",NativeModules)



console.log(BASE_URL_AND,"fdguheiruf",BASE_URL_IOS,"dsjkf")
export const BASE_URL=Platform.OS=='ios'?BASE_URL_IOS:BASE_URL_AND;

const App = () => {
  console.log(BASE_URL,">gd5y>>fghjghjmjef45guhtr6erg>>>",STRIPE_KEY);
const onPress=()=>{

 
   
  // CalendarModule.createCalendarEvent("EVENT","Event called",eventId => {
  //   console.log(`Created a new event with id ${eventId}`);
  // },)
  CalendarModule.addEvent("EVENT","Event called")
  // CalendarModule.createCalendarEvent((res:any)=>console.log(res,"RESPONSEE"))
//  const res=await CalendarModule.createCalendarPromise()
  // console.log("RESPONSE",res)

}
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

  );
};

export default App;

const styles = StyleSheet.create({});
