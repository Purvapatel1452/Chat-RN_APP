import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAPxD1ennIR9miXa01a7aIxzBYV_Toh1S8",
  authDomain: "expense-hive.firebaseapp.com",
  databaseURL: "https://expense-hive.firebaseio.com",
  projectId: "expense-hive",
  storageBucket: "expense-hive.appspot.com",
  messagingSenderId: "390396720228",
  appId: "1:390396720228:android:2a21414a2c67b2dc1d1b71"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;