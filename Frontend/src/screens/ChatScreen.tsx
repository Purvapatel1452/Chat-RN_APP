import React, {useCallback, useEffect, useState} from 'react';

import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import UserChat from '../components/UserChat';
import HeaderBar from '../components/HeaderBar';
import {useNavigation, useFocusEffect, NavigationProp} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFriends, fetchGroups} from '../redux/slices/groupSlice';
import {addExpense} from '../redux/slices/expensesSlice';
import {fetchFriendsPaymentStatus} from '../redux/slices/friendSlice';
import FastImage from 'react-native-fast-image';

const ChatScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [description, setDecription] = useState('');
  const [amount, setAmount] = useState('');

  const [selectedFriends, setSelectedFriends] = useState<any>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [selectGroup, setSelectGroup] = useState('');
  const [select, setSelect] = useState<any>([]);
  const [type, setType] = useState<any>([]);

  const {userId} = useSelector((state: any) => state.auth);
  const {
    groups,
    loading: groupLoading,
    error: groupError,
  } = useSelector((state: any) => state.group);
  const {
    friends,
    loading: friendLoading,
    error: friendError,
  } = useSelector((state: any) => state.group);
  const {loading: expenseLoading, error: expenseError} = useSelector(
    (state: any) => state.expense,
  );
  const {paymentStatus, loading, error} = useSelector(
    (state: any) => state.friend,
  );
  const dispatch = useDispatch();

  const navigation = useNavigation<NavigationProp<any>>();
  const [refresh, setRefresh] = useState(false);

  const handleFriends = async () => {
    setSelect([]);
    setSelectedFriends([]);
    setIsGroup(false);
    dispatch(fetchFriends(userId)).then((response: any) => {
      console.log(response, 'success');
    });
  };

  const handleGroups = async () => {
    setSelectedFriends([]);
    setSelectGroup('');
    setIsGroup(true);
    dispatch(fetchGroups(userId));
  };

  const handleAddExpense = async () => {
    let data = {};
    if (isGroup) {
      data = {
        description: description,
        amount: amount,
        payerId: userId,
        payeeId: selectedFriends,
        groupId: selectGroup,
        type: type,
      };
    } else {
      data = {
        description: description,
        amount: amount,
        payerId: userId,
        payeeId: selectedFriends,
        type: type,
      };
    }

    dispatch(addExpense(data)).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        Alert.alert('Expense Added !!!');
        setShowModal(false);
        setDecription('');
        setAmount('');
        setSelectedFriends([]);
        setSelect([]);
      } else {
        Alert.alert('Error in adding expense');
      }
    });
    dispatch(fetchFriendsPaymentStatus(userId));
  };

  const handleModel = async () => {
    console.log('MODALVIEWW');

    setShowModal(true);
    setSelectedFriends([]);
    setSelectGroup('');
    setSelect([]);
  };

  const handleSelection = (item: any) => {
    if (isGroup) {
      setSelectedFriends(item.members);
      setSelectGroup(item._id);
      setType('group');
    } else {
      if (selectedFriends.includes(item._id)) {
        setSelectedFriends(selectedFriends.filter((id:any) => id !== item._id));
        setSelect(selectedFriends.filter((id:any) => id !== item._id));
      } else {
        setSelectedFriends([...selectedFriends, item._id]);
        setSelect([...selectedFriends, item._id]);
      }
      setType('non-group');
    }
  };

  const acceptedFriendsList = useCallback(async () => {
    try {
      dispatch(fetchFriends(userId)).then((response: any) => {
        console.log(response, 'success');
      });
    } catch (err) {
      console.log('Error in frontend', err);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      const fetchAllData = async () => {
        dispatch(fetchFriends(userId));
        dispatch(fetchFriendsPaymentStatus(userId));
      };
      fetchAllData();
      const unsubscribe = navigation.addListener<any>('tabPress', (e:any) => {
        e.preventDefault();
        setRefresh(!refresh);
      });

      return () => {
        unsubscribe();
      };
    }, [refresh, fetchFriends, fetchFriendsPaymentStatus]),
  );

  useEffect(() => {
    const fetchAllData = async () => {
      dispatch(fetchFriendsPaymentStatus(userId));
      dispatch(fetchFriends(userId));
    };
    fetchAllData();
  }, [refresh, fetchFriendsPaymentStatus, fetchFriends]);

  const combineData = () => {
    return friends.map((friend: any) => {
      const paymentStatusForFriend = paymentStatus.find(
        (status: any) => status.friendId === friend._id,
      );
      return {
        ...friend,
        friendOwesMe: paymentStatusForFriend
          ? paymentStatusForFriend.friendOwesMe
          : 0,
        iOweFriend: paymentStatusForFriend
          ? paymentStatusForFriend.iOweFriend
          : 0,
      };
    });
  };

  const combinedData = combineData();

  return (
    <View style={{flex: 1, backgroundColor: '#f8f8f8'}}>
      <StatusBar backgroundColor={'#D77702'} />
      <HeaderBar title={'ChatScreen'} />
      <ScrollView>
        <Pressable>
          {combinedData.map(
            (item: any, index: React.Key | null | undefined) => (
              <UserChat
                key={index}
                item={item}
                navigateMessages={() => {
                  navigation.navigate('Messages', {recepientId: item._id});
                }}
              />
            ),
          )}
        </Pressable>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('Home')}>
            <AntDesign name="addusergroup" size={22} color={'#D77702'} />
            <Text style={styles.buttonText}>Add Friends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={{position: 'relative'}} onPress={handleModel}>
        <View style={styles.buttonContainer1}>
          <MaterialIcons name="notes" size={22} color={'white'} />
          <Text style={styles.buttonText1}>Add expense</Text>
        </View>
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="edit-note"
                size={50}
                style={{
                  borderWidth: 0.5,
                  borderBottomWidth: 3,
                  borderRadius: 10,
                  borderColor: 'gray',
                }}
                color={'#D77702'}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter a Description"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDecription}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="cash"
                size={45}
                style={{
                  padding: 3,
                  borderWidth: 0.5,
                  borderBottomWidth: 3,
                  borderRadius: 10,
                  borderColor: 'gray',
                }}
                color={'#D77702'}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            <Text style={styles.label}>Select Participants/Groups :</Text>
            <View style={styles.inputContainer1}>
              <TouchableOpacity
                style={[
                  styles.saveButton1,
                  {backgroundColor: !isGroup ? '#D77702' : 'silver'},
                ]}
                onPress={() => handleFriends()}>
                <Text style={styles.saveButtonText}>Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton1,
                  {backgroundColor: isGroup ? '#D77702' : 'silver'},
                ]}
                onPress={() => handleGroups()}>
                <Text style={styles.saveButtonText}>Groups</Text>
              </TouchableOpacity>
            </View>
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
                data={isGroup ? groups : friends}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.friendItem}
                    onPress={() => handleSelection(item)}>
                    <View style={styles.pressableContainer}>
                      <FastImage
                        source={{uri: item.image}}
                        style={styles.image}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.textName}>{item.name}</Text>
                        {isGroup ? (
                          <></>
                        ) : (
                          <Text style={styles.textLast}>{item.email}</Text>
                        )}
                      </View>

                      {isGroup ? (
                        <View style={styles.checkbox}>
                          {selectGroup.includes(item._id) && (
                            <View style={styles.checkedCircle} />
                          )}
                        </View>
                      ) : (
                        <View style={styles.checkbox}>
                          {select.includes(item._id) && (
                            <View style={styles.checkedCircle} />
                          )}
                        </View>
                      )}
                      <View />
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item._id}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleAddExpense()}>
              <Text style={styles.saveButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    borderWidth: 2,
    justifyContent: 'center',
    borderColor: '#D77702',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 20,
    flexDirection: 'row',
    width: 230,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D77702',
    textAlign: 'center',
    marginLeft: 6,
  },
  buttonContainer1: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#D77702',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 8,
  },
  buttonContainer2: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: '#D77702',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 8,
  },
  buttonText1: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  inputContainer1: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 250,
    marginLeft: 2,
  },
  textArea: {
    height: 41,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
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
  saveButton1: {
    backgroundColor: 'darkorange',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 3,
  },
  saveButton: {
    backgroundColor: 'darkorange',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
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
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    resizeMode: 'cover',
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

  leftText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});
