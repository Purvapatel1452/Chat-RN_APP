import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearUser} from '../redux/slices/authSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

import FastImage from 'react-native-fast-image';


import {fetchRecepientData} from '../redux/slices/recepientSlice';
import { BASE_URL } from '../../App';

const UserProfileScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [images, setImages] = useState([]);
  const [ur, setUr] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [load, setLoad] = useState(false);

  const navigation = useNavigation<NavigationProp<any>>();

  const dispatch = useDispatch();
  const {userId} = useSelector((state: any) => state.auth);
  const {recepientDatas, loading, error} = useSelector(
    (state: any) => state.recepient,
  );

  const route = useRoute();
  const {recepientId}: any = route.params;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    dispatch(clearUser());
  };

  useEffect(() => {
    dispatch(fetchRecepientData(recepientId));
  }, [dispatch, recepientId]);

  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      const source: any = {uri: image.path};
      setImage(source);
    } catch (error) {
      console.log('Error in selecting image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      const source: any = {uri: image.path};
      console.log(source);
      setImage(source);
    } catch (error) {
      console.log('Error in capturing photo:', error);
    }
  };
  const getToken = async () => {
    return await AsyncStorage.getItem('authToken');
  };
  const uploadImage = async () => {
    if (!image) return;

    const {uri}: any = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    setUploading(true);
    setTransferred(0);

    const task = storage().ref(`user/${filename}`).putFile(uploadUri);

    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );
    });

    try {
      await task;
      const url = await storage().ref(`user/${filename}`).getDownloadURL();
      const token = getToken();
      console.log(':rtgtjkuhirg', BASE_URL);
      const response = await axios.post(
        `${BASE_URL}/user/uploadImage`,
        {
          userId,
          imageUrl: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response) {
        setUr(url);

        setUploading(false);
        setModalVisible(false);

        Alert.alert('Photo uploaded!');
        setImage(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={'#D77702'} />

      <View style={{alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <View style={{flex: 1, position: 'relative'}}>
            <ImageBackground
              source={{
                uri: 'https://logowik.com/content/uploads/images/hive6576.logowik.com.webp',
              }}
              style={{height: height * 0.24, width: width}}>
              <View style={styles.overlay} />
              <IonIcons
                name="arrow-back-sharp"
                size={28}
                color={'white'}
                style={styles.icon}
                onPress={() => navigation.goBack()}
              />
            </ImageBackground>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            {loading ? (
              <ActivityIndicator size={30} style={{height: 190}} />
            ) : recepientDatas.image ? (
              <FastImage
                source={{uri: recepientDatas.image}}
                style={styles.profileImage}
              />
            ) : (
              <IonIcons
                name="person-outline"
                size={140}
                style={styles.profileImage1}
              />
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <View style={styles.nameContainer}>
              <MaterialIcons
                name="person"
                color="black"
                size={20}
                style={styles.nameLogo}
              />
              <Text style={styles.name}>{recepientDatas.name}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <View style={styles.nameContainer}>
              <MaterialCommunityIcons
                name="email"
                color="black"
                size={20}
                style={styles.nameLogo}
              />

              <Text style={styles.email}>{recepientDatas.email}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.nameContainer}>
              <FontAwesome
                name="mobile"
                color="black"
                size={30}
                style={styles.mobileLogo}
              />
              <Text style={styles.name}> +91 {recepientDatas.mobile}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

export default UserProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.15,
  },

  profileImage: {
    height: height * 0.18,
    width: height * 0.18,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'gray',
  },
  profileImage1: {
    height: height * 0.2,
    width: height * 0.2,
    borderRadius: 100,
    color: 'gray',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 29,
    marginTop: 20,
  },
  imageContainer: {
    elevation: 9,
    borderRadius: 100,
    shadowOpacity: 10,
    shadowColor: 'black',
    borderWidth: 0.5,
    borderColor: 'silver',
    height: height * 0.18,
    width: height * 0.18,
    backgroundColor: '#F2F2F2',
    marginTop: height * 0.001,
  },
  name: {
    color: 'black',
    fontSize: 18,
    left: width * 0.04,
    fontWeight: 'bold',
  },
  email: {
    color: 'gray',
    fontSize: 16,
    left: width * 0.04,
  },
  nameLogo: {
    color: 'black',
    fontSize: 24,
    left: width * 0.02,
    fontWeight: 'bold',
  },
  mobileLogo: {
    color: 'black',
    fontSize: 30,
    left: width * 0.03,
    fontWeight: 'bold',
  },
  nameContainer: {
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: 'orange',
    flexDirection: 'row',

    shadowColor: 'black',
    backgroundColor: 'white',

    marginTop: width * 0.06,
    height: height * 0.065,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flex: 0.9,
  },
  logOutContainer: {
    marginTop: 20,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 10,
    borderWidth: 2,
    padding: 10,
    width: 330,
    height: 50,
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#D77702',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 120,
  },
  uploadButton: {
    borderRadius: 5,
    width: 180,
    height: 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust the opacity to make the image look dull
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
});
