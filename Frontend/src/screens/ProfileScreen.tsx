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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderBar from '../components/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearUser} from '../redux/slices/authSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
// import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import {deleteUserAccount, fetchUserDetails, updateUserProfile} from '../redux/slices/usersSlice';
import {BASE_URL} from '@env';

const ProfileScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [images, setImages] = useState([]);
  const [ur, setUr] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const navigation = useNavigation();

  const dispatch = useDispatch();
  const {userId} = useSelector(state => state.auth);
  const {details, loading, error} = useSelector(state => state.users);

  const route = useRoute();
  const {data} = route.params;

  useEffect(() => {
    if (details) {
      setName(details.name);
      setEmail(details.email);
      setMobile(details.mobile);
    }
  }, [details]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    dispatch(clearUser());
  };

  const handleEditProfile = async () => {
    try {
      const resultAction = await dispatch(
        updateUserProfile({userId, name, mobile}),
      );
      if (updateUserProfile.fulfilled.match(resultAction)) {
        Alert.alert('Profile updated successfully!');
        setEditModalVisible(false);
      } else {
        Alert.alert('Failed to update profile!', resultAction.payload.message);
      }
      setEditModalVisible(false);
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  useEffect(() => {
    dispatch(fetchUserDetails(userId));
  }, [dispatch, userId, ur]);

  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      const source = {uri: image.path};
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
      const source = {uri: image.path};
      console.log(source);
      setImage(source);
    } catch (error) {
      console.log('Error in capturing photo:', error);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    const {uri} = image;
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

      console.log(':');
      const response = await axios.post(`${BASE_URL}/user/uploadImage`, {
        userId,
        imageUrl: url,
      });

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

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action can be undone within 30 days.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const resultAction = await dispatch(deleteUserAccount({userId}));
              if (deleteUserAccount.fulfilled.match(resultAction)) {
                Alert.alert(
                  'Account has been soft deleted. You can recover it within 30 days.',
                );
                await AsyncStorage.removeItem('authToken');
                dispatch(clearUser());
                navigation.navigate('Login');
              } else {
                Alert.alert(
                  'Failed to delete account!',
                  resultAction.payload.message,
                );
              }
            } catch (error) {
              console.log('Error deleting account:', error);
            }
          },
        },
      ],
    );
  };

  const handleRecoverAccount = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/users/recover`,{email,password});
      if (response.status === 200) {
        Alert.alert('Account recovered successfully!');
        dispatch(fetchUserDetails(userId));
      } else {
        Alert.alert('Failed to recover account');
      }
    } catch (error) {
      console.log('Error recovering account:', error);
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
            ) : details.image ? (
              <FastImage
                source={{uri: details.image}}
                style={styles.profileImage}
              />
            ) : (
              <FastImage
                source={{
                  uri: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg',
                }}
                style={styles.profileImage}
              />
            )}
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.add}>
              <MaterialIcons
                name="add-a-photo"
                size={20}
                style={{padding: 8, color: 'black'}}
              />
            </View>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <MaterialIcons
              name="person"
              color="black"
              size={20}
              style={styles.nameLogo}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{details.name}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="email"
              color="black"
              size={20}
              style={styles.nameLogo}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.email}>{details.email}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <FontAwesome
              name="mobile"
              color="black"
              size={30}
              style={styles.mobileLogo}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>+91 {details.mobile}</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', gap: 12}}>
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            style={styles.editContainer}>
            <View style={{}}>
              <Text
                style={{
                  color: 'red',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  elevation: 2,
                  shadowColor: 'black',
                  shadowOpacity: 10,
                }}>
                Edit Profile
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLogout()}
            style={styles.editContainer}>
            <View style={{}}>
              <Text
                style={{
                  color: 'red',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  elevation: 2,
                  shadowColor: 'black',
                  shadowOpacity: 10,
                }}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleDeleteAccount()}
          style={styles.logOutContainer}>
          <View style={{}}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                elevation: 2,
                shadowColor: 'black',
                shadowOpacity: 10,
              }}>
              Delete Account
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {image && (
              <View>
                <FastImage source={{uri: image.uri}} style={styles.imageBox} />
              </View>
            )}
            {uploading ? (
              <View style={styles.modalView}>
                <View style={styles.progressBarContainer}>
                  <Progress.Bar progress={transferred} width={260} />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : image ? (
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={uploadImage}>
                  <Text style={styles.buttonText}>Upload image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={selectImage}>
                  <Text style={styles.modalButtonText}>Select Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={takePhoto}>
                  <Text style={styles.modalButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={text => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile"
              value={mobile}
              onChangeText={text => setMobile(text)}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleEditProfile()}>
              <Text style={styles.modalButtonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  add: {
    borderWidth: 1,
    borderRadius: 40,
    height: 40,
    width: 40,
    backgroundColor: 'silver',
    marginLeft: 110,
    marginTop: -34,
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
    borderColor: 'silver',
    borderWidth: 0.5,
    height: height * 0.18,
    width: height * 0.18,
    backgroundColor: 'silver',
    marginTop: height * 0.001,
  },
  name: {
    color: 'black',
    fontSize: 16,

    fontWeight: 'bold',
  },
  email: {
    color: 'gray',
    fontSize: 14,
  },
  nameLogo: {
    color: 'black',
    fontSize: 25,
    marginTop: height * 0.03,
    marginLeft: width * 0.04,
    fontWeight: 'bold',
  },
  mobileLogo: {
    color: 'black',
    fontSize: 30,
    marginTop: height * 0.034,
    marginRight: 6,

    fontWeight: 'bold',
    marginLeft: width * 0.06,
  },
  input: {
    height: 40,
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: 250,
  },
  nameContainer: {
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: 'orange',

    shadowColor: 'black',
    backgroundColor: 'white',
    width: 100,
    marginTop: 20,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingTop: 5,

    flex: 1,
    marginRight: width * 0.09,
  },
  logOutContainer: {
    marginTop: 100,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 10,
    borderWidth: 2,
    padding: 10,
    width: width * 0.88,
    height: 50,
    borderColor: 'white',
    backgroundColor: 'red',
    borderRadius: 20,
  },
  editContainer: {
    marginTop: 20,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 10,
    borderWidth: 2,
    padding: 10,
    width: width * 0.42,
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
