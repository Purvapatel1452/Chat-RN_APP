import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage:any) => {
  console.log('Message handled in the background!', remoteMessage);
  showNotification(remoteMessage.notification.title, remoteMessage.notification.body);
});

const showNotification = (title:any, message:any) => {
  PushNotification.localNotification({
    channelId: "1", 
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
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('FCM Token:', fcmToken);
    return fcmToken
    // You can send the token to your server or save it locally
  } else {
    console.log('Failed to get FCM token');
    return null;
  }
};

const createNotificationChannel = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: "1", // Must be unique
        channelName: "Default Channel", // Visible channel name
        channelDescription: "A default channel", // Description
        soundName: "default", // Default sound
        importance: 4, // High importance
        vibrate: true, // Default vibration
      },
      (created) => console.log(`CreateChannel returned '${created}'`), // Log result
    );
  }
};

// Call the function to create the channel
createNotificationChannel();


export { requestUserPermission, getToken, showNotification };
