import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
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

import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import {
  deleteUserAccount,
  fetchUserDetails,
  updateUserProfile,
} from '../redux/slices/usersSlice';
import {BASE_URL} from '../../App';
import {SafeAreaFrameContext} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native';

const ProfileScreen = () => {
  const [image, setImage] = useState<any>(null);
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

  const navigation = useNavigation<NavigationProp<any>>();

  const dispatch = useDispatch();
  const {userId} = useSelector((state: any) => state.auth);
  const {details, loading, error} = useSelector((state: any) => state.users);

  const route = useRoute();
  const {data}: any = route.params;

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
    console.log(details.image, '::');
  }, [dispatch, userId, ur]);

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
      console.log('rt54turgfdrte5ykyi:', BASE_URL);
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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor={'#D77702'} />

      <View style={{alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <View style={{flex: 1, position: 'relative', height: height * 0.45}}>
            <ImageBackground
              source={{
                uri: 'https://logowik.com/content/uploads/images/hive6576.logowik.com.webp',
              }}
              style={{height: height * 0.26, width: width}}>
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

          <View style={{flexDirection: 'row', gap: 0, width: width * 0.7}}>
            <View style={styles.balContainer}>
              <View>
                <Text style={styles.bal}>balance:</Text>
              </View>
              <View style={styles.line}></View>
              <View>
                {details.balance < 0 ? (
                  <Text style={styles.redname}>{`₹ ${details.balance.toFixed(
                    2,
                  )}`}</Text>
                ) : (
                  <Text style={styles.greenname}>{`₹ ${details.balance.toFixed(
                    2,
                  )}`}</Text>
                )}
              </View>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', gap: 8,marginBottom:40}}>
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
                  }}>
                  Log Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        <View style={{flex:1}}>
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
                  shadowOffset: {height: 1, width: 0},
                }}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>
          </View>
      
        </View>
           
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
    
    </SafeAreaView>
  );
};

const {width, height} = Dimensions.get('window');

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#D77702',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.24,
    backgroundColor: '#f2f2f2',
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
    shadowOffset: {height: 0, width: 0},
    shadowColor: 'black',
    borderColor: 'silver',
    borderWidth: 0.5,
    height: height * 0.18,
    width: height * 0.18,
    backgroundColor: 'silver',
    marginTop: -height * 0.09,
  },
  name: {
    color: 'black',
    fontSize: 16,

    fontWeight: 'bold',
  },
  bal: {
    color: 'black',
    fontSize: 22,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginRight: 38,
  },
  line: {
    borderWidth: 1,
    flex: 0.00000000001,
    height: 75,
    margin: 20,
    right: 30,
    borderColor: 'gray',
  },
  greenname: {
    color: 'green',
    fontSize: 20,
    right: 18,
    fontWeight: 'bold',
  },
  redname: {
    color: 'red',
    fontSize: 16,
    right: 18,
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
  balContainer: {
    borderBottomWidth: 1,
    borderRadius: 20,
    borderColor: 'orange',
    shadowColor: 'black',
    backgroundColor: 'white',
    width: width * 0.5,
    marginTop: 20,
    height: height * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: 10,
    paddingTop: 5,
    elevation: 5,
    flex: 1,
    flexDirection: 'row',
  },
  logOutContainer: {
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
    shadowOffset:{height:0,width:0},
    
  },
  editContainer: {
    elevation: 2,
    shadowColor: 'gray',
    shadowOpacity: 10,
    borderWidth: 2,
    padding: 10,
    width: width * 0.42,
    height: 50,
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 20,
    bottom: -30,
    shadowOffset:{height:1,width:1},
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
});
