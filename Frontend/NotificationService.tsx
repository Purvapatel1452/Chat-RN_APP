import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage:any) => {
  console.log('Message handled in the background!', remoteMessage);
  showNotification(remoteMessage.notification.token, remoteMessage.notification.title, remoteMessage.notification.body);
});

const showNotification = (token:any, title:any, message:any) => {
  console.log(token,"TTOOKK")
  PushNotification.localNotification({
    channelId: "1", 
    token: token,
    title: title,
    message: message,
  });
  
};

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;


  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};


const getToken = async () => {
  
 return await messaging().getToken();
  
};

const createNotificationChannel = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: "1", 
        channelName: "Default Channel", 
        channelDescription: "A default channel", 
        soundName: "default",
        importance: 4,
        vibrate: true, 
      },
      (created) => console.log(`CreateChannel returned '${created}'`), // Log result
    );
  }
};


createNotificationChannel();


export { requestUserPermission, getToken, showNotification };



