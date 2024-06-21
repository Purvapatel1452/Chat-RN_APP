import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
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
import {NavigationProp, useNavigation, useRoute} from '@react-navigation/native';

import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

import {BASE_URL} from '@env';
import {editGroup, fetchGroupData} from '../redux/slices/groupSlice';
import UserChat from '../components/UserChat';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatProfileScreen = () => {
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [images, setImages] = useState([]);
  const [ur, setUr] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<any>([]);

  const navigation = useNavigation<NavigationProp<any>>();

  const dispatch = useDispatch();
  const {userId} = useSelector((state:any) => state.auth);
  const {groupData, friends, loading, error} = useSelector(
    (state:any) => state.group,
  );

  const route = useRoute();
  const {groupId}:any = route.params;

  useEffect(() => {
    dispatch(fetchGroupData(groupId));
  }, [dispatch, groupId, ur, editModal]);

  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.name);
      setGroupDescription(groupData.description);
      setMembers(groupData.members.map((member:any) => member._id));
      setSelectedFriends(groupData.members.map((member:any) => member._id));
    }
  }, [groupData]);

  const handleEditGroup = () => {
    console.log('UPDATED');
    const updatedGroupData = {
      name: groupName,
      description: groupDescription,
      members: selectedFriends,
      image: groupData.image,
    };
    console.log(updatedGroupData, 'Lllll');
    dispatch(editGroup({groupId, groupData: updatedGroupData, userId}))
      .then(() => {
        Alert.alert('Group updated successfully!');
        setEditModal(false);
      })
      .catch((error:any) => {
        Alert.alert('Failed to update group:', error.message);
      });
  };

  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      const source:any = {uri: image.path};
      setImage(source);
    } catch (error) {
      console.log('Error in selecting image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      console.log('CMAera');
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      const source:any = {uri: image.path};

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

    const {uri}:any = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    setUploading(true);
    setTransferred(0);
    console.log(uploadUri,"UURI")
    const task = storage().ref(`group/${filename}`).putFile(uploadUri);
console.log(task,"TASK")
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );
      console.log("i")
    });

    try {
      await task;
      const url = await storage().ref(`group/${filename}`).getDownloadURL();
      console.log(url)
      const token=getToken()
      console.log(':sdthyhgfytthce', BASE_URL);
       await axios.post(`${BASE_URL}/group/uploadGroupImage`, {
        groupId: groupData._id,
        imageUrl: url,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
        setUr(url);

        setUploading(false);
        setModalVisible(false);

        Alert.alert('Photo uploaded!');
        setImage(null);
     
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelection = (friendId:any) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id:any) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={'#D77702'} />

      <View
        style={{
          flex: 1,
          position: 'relative',
          borderBottomWidth: 1,
          elevation: 5,
          backgroundColor: 'white',
          shadowColor: 'black',
        }}>
        <ImageBackground
          source={{uri: groupData.image}}
          style={{height: height * 0.328, width: width}}>
          <View style={styles.overlay} />
          <IonIcons
            name="arrow-back-sharp"
            size={28}
            color={'white'}
            style={styles.icon}
            onPress={() => navigation.goBack()}
          />
        </ImageBackground>
        <View style={{position: 'relative', top: -height * 0.3}}>
          <View style={styles.groupNameContainer}>
            <Text style={styles.headerText}>{groupData.name}</Text>
            <Text style={styles.desc}>{groupData.description}</Text>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.add}>
            <MaterialIcons
              name="add-a-photo"
              size={20}
              style={{padding: 8, color: 'black'}}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.lengthContainer}>
          <Text style={styles.memberLength}>
            {groupData.members.length} members
          </Text>
        </View>

        <ScrollView
          style={{
            height: height * 0.6,
            marginBottom: 70,
            width: width * 1,
            top: height * 0.02,
          }}>
          <Pressable>
            {groupData.members.map((item:any, index: React.Key | null | undefined) => (
              <UserChat
                key={index}
                item={item}
                navigateMessages={() => {
                  navigation.navigate('Messages', {recepientId: item._id});
                }}
              />
            ))}
          </Pressable>
        </ScrollView>
      </View>

      {groupData.admin == userId ? (
        <TouchableOpacity
          onPress={() => setEditModal(true)}
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
              Edit Group
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}

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
        visible={editModal}
        onRequestClose={() => setEditModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={groupName}
              onChangeText={setGroupName}
            />
            <TextInput
              style={styles.input}
              placeholder="Group Description"
              value={groupDescription}
              onChangeText={setGroupDescription}
            />
            <Text style={styles.label}>Select Friends:</Text>
            <View
              style={{
                height: 220,
                borderWidth: 2,
                borderColor: 'gray',
                borderRadius: 20,
                elevation: 2,
                backgroundColor: 'white',
                padding: 5,
              }}>
              <FlatList
                data={friends}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.friendItem}
                    onPress={() => handleSelection(item._id)}>
                    <View style={styles.pressableContainer}>
                      <FastImage source={{uri: item.image}} style={styles.image} />
                      <View style={styles.textContainer}>
                        <Text style={styles.textName}>{item.name}</Text>
                        <Text style={styles.textLast}>{item.email}</Text>
                      </View>
                      <View style={styles.checkbox}>
                        {selectedFriends.includes(item._id) && (
                          <View style={styles.checkedCircle} />
                        )}
                      </View>
                      <View />
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item._id}
              />
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleEditGroup()}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setEditModal(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

export default ChatProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.079,
  },
  add: {
    borderWidth: 1,
    borderRadius: 40,
    height: 40,
    width: 40,
    borderColor: 'gray',
    elevation: 2,
    shadowColor: 'black',
    backgroundColor: 'white',
    left: width * 0.43,
    top: height * 0.033,
    marginTop: height * 0.04,
  },
  profileImage: {
    height: height * 0.2,
    width: width * 0.4,
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
    borderWidth: 1,
    height: height * 0.2,
    width: height * 0.2,
    backgroundColor: '#F2F2F2',
    marginTop: 11,
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
    marginTop: height * 0.24,
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
  nameContainer: {
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: 'orange',

    shadowColor: 'black',
    backgroundColor: 'white',
    width: 100,
    marginTop: 200,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingTop: 5,

    flex: 1,
    marginRight: width * 0.09,
  },
  logOutContainer: {
    marginTop: 20,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 10,
    borderWidth: 1,
    padding: 10,
    width: 330,
    height: 50,
    borderColor: 'white',
    backgroundColor: '#D77702',
    borderRadius: 20,
    bottom: height * 0.1,
    alignSelf: 'center',
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.9,
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
    top: 20,
    left: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500',
  },
  groupNameContainer: {
    position: 'absolute',
    top: -height * 0.01,
    left: 55,
  },
  desc: {
    position: 'relative',
    top: -height * 0.02,
    left: width * 0.002,
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    marginTop: 20,
  },
  descriptionContainer: {
    position: 'absolute',
    marginTop: -20,
    left: width * 0.074,
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    flexDirection: 'row',
    gap: -8,
  },
  lengthContainer: {
    alignSelf: 'flex-start',
    left: width * 0.045,
    top: height * 0.045,
    position: 'absolute',
  },
  memberLength: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'silver',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: 'silver',
    padding: 15,

    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 0,
    flexDirection: 'row',
    width: width,
  },
  input: {
    borderWidth: 2,
    borderColor: 'silver',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderWidth: 1,
    margin: 5,
    borderRadius: 10,
    height: 60,
    borderColor: 'gray',
    elevation: 2,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 20,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'gray',
  },
  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.9,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: '#D0D0D0',
    padding: 5,
  },
  textContainer: {
    flex: 1,
  },
  textName: {
    fontWeight: '500',
    fontSize: 15,
    color: 'black',
  },
  textLast: {
    color: 'gray',
    fontWeight: '500',
  },
  textTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#585858',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
});
