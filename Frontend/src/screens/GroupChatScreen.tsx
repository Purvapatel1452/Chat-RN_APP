import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import EmojiSelector from 'react-native-emoji-selector';
import {useRoute} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderBar from '../components/HeaderBar';

import ExpenseBox from '../components/ExpenseBox';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMessages, sendMessage} from '../redux/slices/chatSlice';
import {fetchGroupData, fetchGroupExpenses} from '../redux/slices/groupSlice';
import storage from '@react-native-firebase/storage';
import Modal from 'react-native-modal';
import {BASE_URL} from '@env';
import HeaderChatBar from '../components/HeaderChatBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

const GroupChatScreen = ({navigation}: any) => {
  console.log(BASE_URL,"gfy");
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);

  const route = useRoute();
  const {groupId}: any = route.params;
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const scrollViewRef = useRef(null);

  const [isExpense, setIsExpense] = useState(true);
  const [expenseList, setExpenseList] = useState([]);

  const dispatch = useDispatch();
  const {userId} = useSelector((state:any) => state.auth);
  const {messages, loading, error} = useSelector((state:any) => state.chat);
  const {
    groupExpenses,
    groupData,
    loading: expenseLoading,
    error: expenseError,
  } = useSelector((state:any) => state.group);

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const isexpense = () => {
    setIsExpense(true);
  };

  const isChat = () => {
    setIsExpense(false);
  };

  useEffect(() => {
    dispatch(fetchMessages({userId, groupId}));
    dispatch(fetchGroupExpenses(groupId));
    dispatch(fetchGroupData(groupId));
  }, [dispatch, userId, groupId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 800);
  };

  const handleSend:any = async (messageType: any, imageUri: any) => {
    try {
      console.log('SENNDD');

      //check msg type image or text
      let formData = {};
      if (messageType == 'image') {
        const {uri} = imageUri;

        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        console.log(uploadUri, 'LLLL');

        const task = storage().ref(`chat/${filename}`).putFile(uploadUri);
        toggleModal();

        try {
          await task;
          const url = await storage().ref(`chat/${filename}`).getDownloadURL();
          console.log(url);

          console.log(url, 'URLRLRL');
          formData = {
            senderId: userId,
            groupId: groupId,
            messageType: messageType,
            messageText: message,
            imageUrl: url,
          };

          console.log('IIIOOPPP', formData);
        } catch (e) {
          console.error(e);
        }
      } else {
        console.log('1111');
        formData = {
          senderId: userId,
          groupId: groupId,
          messageType: messageType,
          messageText: message,
          imageUrl: null,
        };
      }

      console.log({formData});

      dispatch(sendMessage({formData})).then((response:any) => {
        console.log(response, '))))))');
      });

      if (messageType == 'image') {
        setTimeout(() => {
          dispatch(fetchMessages({userId, groupId: groupId}));
        }, 2000);
      } else {
        setTimeout(() => {
          dispatch(fetchMessages({userId, groupId: groupId}));
        }, 1000);
      }

      setMessage('');
      setSelectedImage('');

      scrollToBottom();
    } catch (err) {
      console.log('error in sending msg', err);
    }
  };

  const formatTime = (time: any) => {
    const options:any = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };

  const pickImage = async () => {
    await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log('IIIOOPP', image.path);
        const source = {uri: image.path};
        handleSend('image', source);
      })
      .catch(err => {
        console.log('Error in uploading image', err);
      });
  };

  const pickCamera = async () => {
    await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log('IIIOOPP', image.path);
      const source = {uri: image.path};
      handleSend('image', source);
    });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderChatBar title={'GroupChatScreen'} id={groupId} />

      <View style={styles.pressableContainer}>
      <TouchableOpacity  style={styles.pressableContainer1} onPress={() => isexpense()}>
        <View>
         
            <Text style={{color: 'black'}}>Expenses</Text>
                 </View>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.pressableContainer2} onPress={() => isChat()}>
        <View >
         
            <Text style={{color: 'black'}}>Chat</Text>
        
        </View>
        </TouchableOpacity>
      </View>
      {isExpense ? (
        <ScrollView>
          <Pressable>
            {expenseLoading ? (
              <ActivityIndicator />
            ) : expenseError ? (
              <Text>Error loading expenses: {expenseError}</Text>
            ) : (
              groupExpenses.map((item:any, index: React.Key | null | undefined) => (
                <ExpenseBox key={index} item={item} />
              ))
            )}
          </Pressable>
        </ScrollView>
      ) : (
        <KeyboardAvoidingView style={styles.keyboardContainer}>
          <ScrollView ref={scrollViewRef}>
            {messages.map((item: any, index: React.Key | null | undefined) => {
              if (item.messageType == 'text') {
                return (
                  <Pressable
                    key={index}
                    style={[
                      !item.senderId._id
                        ? {
                            alignSelf: 'flex-end',
                            backgroundColor: '#DCF8C6',
                            padding: 8,
                            maxWidth: '60%',
                            borderRadius: 7,
                            margin: 10,
                          }
                        : item.senderId._id == userId
                        ? {
                            alignSelf: 'flex-end',
                            backgroundColor: '#DCF8C6',
                            padding: 8,
                            maxWidth: '60%',
                            borderRadius: 7,
                            margin: 10,
                          }
                        : {
                            alignSelf: 'flex-start',
                            backgroundColor: 'white',
                            padding: 8,
                            margin: 10,
                            borderRadius: 7,
                            maxWidth: '60%',
                          },
                    ]}>
                    {item.senderId._id == userId ? (
                      <>
                        <Text style={styles.textMessage}>{item.message}</Text>
                        <Text style={styles.textMsgTime}>
                          {formatTime(item.timeStamp)}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.senderName}>
                          {item.senderId.name}
                        </Text>
                        <Text style={styles.textMessage}>{item.message}</Text>
                        <Text style={styles.textMsgTime}>
                          {formatTime(item.timeStamp)}
                        </Text>
                      </>
                    )}
                  </Pressable>
                );
              }
              if (item.messageType === 'image' ?? !loading) {
                const source = item.imageUrl;

                return (
                  <Pressable
                    key={index}
                    style={[
                      !item.senderId._id
                        ? {
                            alignSelf: 'flex-end',
                            backgroundColor: '#DCF8C6',
                            padding: 8,
                            maxWidth: '60%',
                            borderRadius: 7,
                            margin: 10,
                          }
                        : item.senderId._id == userId
                        ? {
                            alignSelf: 'flex-end',
                            backgroundColor: '#DCF8C6',
                            padding: 8,
                            maxWidth: '60%',
                            borderRadius: 7,
                            margin: 10,
                          }
                        : {
                            alignSelf: 'flex-start',
                            backgroundColor: 'white',
                            padding: 8,
                            margin: 10,
                            borderRadius: 7,
                            maxWidth: '60%',
                          },
                    ]}>
                    <View>
                      {item.senderId._id == userId ? (
                        <>
                          <FastImage
                            source={{uri: source}}
                            style={{width: 200, height: 200, borderRadius: 7}}
                          />
                          <Text
                            style={{
                              textAlign: 'right',
                              fontSize: 9,
                              position: 'absolute',
                              right: 10,
                              bottom: 7,
                              color: 'white',
                              marginTop: 5,
                            }}>
                            {formatTime(item?.timeStamp)}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.senderName}>
                            {item.senderId.name}
                          </Text>
                          <FastImage
                            source={{uri: source}}
                            style={{width: 200, height: 200, borderRadius: 7}}
                          />
                          <Text
                            style={{
                              textAlign: 'right',
                              fontSize: 9,
                              position: 'absolute',
                              right: 10,
                              bottom: 7,
                              color: 'white',
                              marginTop: 5,
                            }}>
                            {formatTime(item?.timeStamp)}
                          </Text>
                        </>
                      )}
                    </View>
                  </Pressable>
                );
              } else {
                return <ActivityIndicator />;
              }
            })}
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              paddingBottom: 60,

              borderTopWidth: 1,
              borderTopColor: '#dddddd',
              marginBottom: showEmojiSelector ? 0 : 20,
            }}>
            <Entypo
              onPress={() => handleEmojiPress()}
              name="emoji-happy"
              style={{marginRight: 5}}
              size={24}
              color="gray"
            />

            <TextInput
              style={styles.inputText}
              value={message}
              onChangeText={text => setMessage(text)}
              placeholder="Type your message ..."
              placeholderTextColor={'gray'}
            />

            <View style={styles.iconContainer}>
              <Entypo
                onPress={toggleModal}
                name="camera"
                size={24}
                color="gray"
              />

            </View>

            <Pressable
              onPress={() => handleSend('text')}
              style={styles.sendContainer}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>

          {showEmojiSelector && (
            <EmojiSelector
              style={{height: 250}}
              onEmojiSelected={emoji => {
                setMessage(prevMessage => prevMessage + emoji);
              }}
            />
          )}
        </KeyboardAvoidingView>
      )}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={pickImage} style={styles.iconContainer1}>
              <Feather name="image" size={30} color="#595959" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickCamera}
              style={styles.iconContainer1}>
              <Feather name="camera" size={30} color="#595959" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleModal} style={{marginTop: 20}}>
            <Text style={styles.modalOption}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupChatScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  headerProfilePic: {
    height: 350,
    width: 35,
    borderRadius: 17,
  },
  inputText: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    color: 'black',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  sendContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#D77702',
  },
  sendText: {
    fontWeight: 'bold',
    color: 'white',
  },
  nameText: {
    color: 'black',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 15,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textMessage: {
    fontSize: 15,
    textAlign: 'left',
    color: 'black',
  },
  textMsgTime: {
    fontSize: 11,
    textAlign: 'right',
    color: 'gray',
    marginTop: 4,
  },
  senderName: {
    fontSize: 11,
    textAlign: 'left',
    color: '#D77702',
    marginBottom: 5,
    fontWeight: '600',
  },
  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.9,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    padding: 10,
    justifyContent: 'center',
    
  },
  pressableContainer1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#D77702',
    padding: 5,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius:10,
    marginTop: -5,
    height: 40,
  },
  pressableContainer2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#D77702',
    padding: 5,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius:10,
    marginTop: -5,
    height: 40,
  },
  modalOption: {
    fontSize: 18,
    padding: 5,
    textAlign: 'center',
  },
  iconContainer1: {
    backgroundColor: 'silver',
    borderRadius: 50,
    padding: 15,
  },
});
