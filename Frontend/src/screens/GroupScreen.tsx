import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';

import GroupBox from '../components/GroupBox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import HeaderBar from '../components/HeaderBar';

import {useDispatch, useSelector} from 'react-redux';

import User from '../components/User';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createGroup,
  fetchFriends,
  fetchGroupPaymentStatus,
  fetchGroups,
} from '../redux/slices/groupSlice';
import {addExpense} from '../redux/slices/expensesSlice';

import ImagePicker, {openCamera} from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';


import {fetchFriendsPaymentStatus} from '../redux/slices/friendSlice';
import {fetchUserSubscription} from '../redux/slices/subscriptionSlice';
import {useFocusEffect} from '@react-navigation/native';

interface GroupScreenProps {
  navigation: any;
}

const GroupScreen: React.FC<GroupScreenProps> = ({navigation}) => {


  const [showModal, setShowModal] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const [selectedFriends, setSelectedFriends] = useState<any>([]);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseSelect, setExpenseSelect] = useState<any>([]);
  const [expenseSelectedFrnds, setExpenseSelectedFrnds] = useState<any>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const [expenseSelectGroup, setExpenseSelectGroup] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const {userId} = useSelector((state:any) => state.auth);

  const {
    groups,
    loading: groupLoading,
    error: groupError,
  } = useSelector((state:any) => state.group);
  const {
    friends,
    loading: friendLoading,
    error: friendError,
  } = useSelector((state:any) => state.group);
  const {
    groupPaymentStatus,
    loading: groupStatusLoading,
    error: groupStatusError,
  } = useSelector((state:any) => state.group);
  const {loading: expenseLoading, error: expenseError} = useSelector(
    (state:any) => state.expense,
  );


  const {
    subscription,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSelector((state:any) => state.sub);

  useEffect(() => {
    console.log('USESUB');
    dispatch(fetchUserSubscription(userId));
  }, [dispatch, setShowModal, setShowExpenseModal, userId]);

  const checkSubscription = async () => {
    dispatch(fetchUserSubscription(userId));
    const currentDate = new Date();
    const subscriptionEndDate = new Date(subscription.subscriptionEndDate);
    console.log(
      subscription,
      subscriptionEndDate.getTime() >= currentDate.getTime(),
      'SATU',
    );

    if (
      subscription &&
      subscriptionEndDate.getTime() >= currentDate.getTime()
    ) {
      return true;
    } else {
      setShowSubscriptionModal(true);
      return false;
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedFriends.length < 1) {
      return Alert.alert('Please enter Mandatory details !!!');
    }

    const groupData = {
      name: groupName,
      description: groupDescription,
      members: [...selectedFriends, userId],
      adminId: userId,
    };

    dispatch(createGroup(groupData)).then((response:any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        Alert.alert('Group Created Successfully!');
        setShowModal(false);
        setGroupName('');
        setGroupDescription('');
        setSelectedFriends([]);
      } else {
        Alert.alert('Group Already Exists with same Name and Members!');
      }
    });
  };

  const handleFriends = async () => {
    setExpenseSelect([]);
    setExpenseSelectedFrnds([]);
    setIsGroup(false);
    try {
      dispatch(fetchFriends(userId)).then((response:any) => {
        console.log('success');
      });
    } catch (error) {
      console.log('internal server error', error);
    }
  };

  const handleGroups = async () => {
    setExpenseSelectedFrnds([]);
    setExpenseSelectGroup('');
    setIsGroup(true);
  };

  const handleAddExpense = async () => {
    let data = {};
    if (isGroup) {
      data = {
        description: expenseDescription,
        amount: amount,
        payerId: userId,
        payeeId: expenseSelectedFrnds,
        groupId: expenseSelectGroup,
        type: type,
      };
    } else {
      data = {
        description: expenseDescription,
        amount: amount,
        payerId: userId,
        payeeId: expenseSelectedFrnds,
        type: type,
      };
    }

    dispatch(addExpense(data)).then((response:any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        Alert.alert('Expense Added !!!');
        setShowExpenseModal(false);
        setExpenseDescription('');
        setAmount('');
        setExpenseSelectedFrnds([]);
      } else {
        Alert.alert('Error in adding expense');
      }
    });
    dispatch(fetchGroupPaymentStatus(userId));
  };

  const handleExpenseModal = async () => {
    console.log('EXPENSE');
    const isSubscribed = await checkSubscription();
    console.log(isSubscribed);
    if (!isSubscribed) return;
    console.log('MODALVIEWW');

    setShowExpenseModal(true);
    setExpenseSelect([]);
    setExpenseSelectGroup('');
    setExpenseSelect([]);
  };

  const pickImage = async () => {
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

  const pickCamera = async () => {
    try {
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

  const handleModel = async () => {
    console.log('suns');
    const isSubscribed = await checkSubscription();
    console.log(isSubscribed);
    if (!isSubscribed) return;

    setShowModal(true);
    try {
      dispatch(fetchFriends(userId)).then((response:any) => {
        console.log('success');
      });
    } catch (error) {
      console.log('internal server error', error);
    }
  };

  const handleSelection = (friendId:any) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id:any) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleExpenseSelection = (item:any) => {
    if (isGroup) {
      setExpenseSelectedFrnds(item.members);
      setExpenseSelectGroup(item._id);
      setType('group');
    } else {
      if (expenseSelectedFrnds.includes(item._id)) {
        setExpenseSelectedFrnds(
          expenseSelectedFrnds.filter((id:any) => id !== item._id),
        );
        setExpenseSelect(expenseSelectedFrnds.filter((id:any) => id !== item._id));
      } else {
        setExpenseSelectedFrnds([...expenseSelectedFrnds, item._id]);
        setExpenseSelect([...expenseSelectedFrnds, item._id]);
      }
      setType('non-group');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAllData = async () => {
        dispatch(fetchGroups(userId));

        dispatch(fetchFriends(userId));
        dispatch(fetchFriendsPaymentStatus(userId));
        dispatch(fetchGroupPaymentStatus(userId));
      };
      fetchAllData();
      const unsubscribe = navigation.addListener('tabPress', (e:any) => {
        e.preventDefault();
        setRefresh(!refresh);
      });

      return () => {
        unsubscribe();
      };
    }, [refresh, userId, fetchGroupPaymentStatus, fetchGroups]),
  );

  useEffect(() => {
    const fetchAllData = async () => {
      dispatch(fetchGroups(userId));

      dispatch(fetchFriends(userId));
      dispatch(fetchFriendsPaymentStatus(userId));
      dispatch(fetchGroupPaymentStatus(userId));
    };
    fetchAllData();
  }, [refresh, userId, fetchGroupPaymentStatus, fetchGroups]);

  const combineData = () => {
    return groups.map((group:any) => {
      const paymentStatusForGroup = groupPaymentStatus.find(
        (status:any) => status.groupId === group._id,
      );
      return {
        ...group,
        groupOwesMe: paymentStatusForGroup
          ? paymentStatusForGroup.groupOwesMe
          : 0,
        iOweGroup: paymentStatusForGroup ? paymentStatusForGroup.iOweGroup : 0,
      };
    });
  };

  const combinedData = combineData();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#D77702'}}>
   
      {/* <StatusBar backgroundColor="#D77702" barStyle="dark-content" /> */}

      <HeaderBar title={'GroupScreen'}  onIconPress={handleModel} />
      <ScrollView style={styles.scrollContainer}>
        {
          combinedData.length<1 ?
          <View style={{alignSelf:"center",gap:10,}}>

            <FastImage source={{uri:"https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696458.jpg"}} style={{height:400,width:400,top:60}} />
            <Text style={{fontWeight:"bold",fontSize:38,color:"black",alignSelf:"center",top:2}}>No Groups !</Text>
          </View>
        
          :
          
 
          <Pressable>
          {combinedData.map((item:any, index: React.Key | null | undefined) => (
            <GroupBox key={index} item={item} />
          ))}
        </Pressable>
        
     
        }
     
        {
          combinedData.length<1 ?
          <></>
          :
          <View style={styles.container}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => handleModel()}>
            <AntDesign name="addusergroup" size={22} color={'#D77702'} />
            <Text style={styles.buttonText}>Create new group</Text>
          </TouchableOpacity>
        </View>}
      </ScrollView>

      <TouchableOpacity
        style={{position: 'relative'}}
        onPress={() => handleExpenseModal()}>
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
                style={styles.input1}
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
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
                style={[styles.input, styles.textArea]}
                placeholder="Group Description"
                multiline
                numberOfLines={4}
                value={groupDescription}
                onChangeText={setGroupDescription}
              />
            </View>
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
                      {
                        item.image ?
                        <FastImage source={{uri: item.image}} style={styles.image} />
                        :
                        <FastImage
                        source={{
                          uri: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg',
                        }}
                        style={styles.image}
                      />
                      }
            
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
              style={styles.saveButton}
              onPress={() => handleCreateGroup()}>
              <Text style={styles.saveButtonText}>Create Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={showExpenseModal}>
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
                value={expenseDescription}
                onChangeText={setExpenseDescription}
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
                keyboardType='number-pad'
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
                margin: 5,
              }}>
              <FlatList
                data={isGroup ? groups : friends}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.friendItem}
                    onPress={() => handleExpenseSelection(item)}>
                    <View style={styles.pressableContainer}>
                      {
                        item.image ?
                        <FastImage source={{uri: item.image}} style={styles.image} />
                        :
                        <FastImage
                        source={{
                          uri: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg',
                        }}
                        style={styles.image}
                      />
                      }
            
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
                          {expenseSelectGroup.includes(item._id) && (
                            <View style={styles.checkedCircle} />
                          )}
                        </View>
                      ) : (
                        <View style={styles.checkbox}>
                          {expenseSelect.includes(item._id) && (
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
              onPress={() => setShowExpenseModal(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showSubscriptionModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You need to subscribe to access this feature.
            </Text>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => navigation.navigate('Payment')}>
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSubscriptionModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
    backgroundColor:"white"
  },
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
    marginBottom: 100,
    flexDirection: 'row',
    width: 230,
    marginTop: 10,
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
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D77702',
    textAlign: 'center',
    marginLeft: 6,
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
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 250,
    marginLeft: 2,
  },
  input1: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 250,
    marginLeft: 2,
    marginRight: 50,
  },
  textArea: {
    height: 41,
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
    height: 40,
    width: 40,
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
  saveButton1: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 3,
  },
  inputContainer1: {
    flexDirection: 'row',
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
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: '#D77702',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems:"center"
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

