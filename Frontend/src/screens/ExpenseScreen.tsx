import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';

import {useRoute} from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {useDispatch, useSelector} from 'react-redux';
import {fetchExpense, updatePaymentStatus} from '../redux/slices/expenseSlice';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeModules } from 'react-native';

const ExpenseScreen = ({navigation}: any) => {
  const route = useRoute();
  const {expenseId}: any = route.params;
  const {CalendarModule}=NativeModules

  const {userId} = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const {expens, loading, error} = useSelector((state: any) => state.expense);
  const {
    friends,
    loading: friendLoading,
    error: friendError,
  } = useSelector((state:any) => state.group);

  const [showModal,setShowModal]=useState(false)
  const [title,setTitle]=useState('');
  const [location,setLocation]=useState('')
  const [selectedFriends, setSelectedFriends] = useState<any>([]);
  const [selectedFriendsEmail, setSelectedFriendsEmail] = useState<any>([]);

  

  const [load, setLoad] = useState(false);
  const [ld, setLd] = useState(true);
  setTimeout(() => {
    setLd(false);
  }, 2000);

  useEffect(() => {});
  useEffect(() => {
    console.log('EUUSEE');
  }, []);

  const fetchExpenseDetails = async () => {
    try {
      dispatch(fetchExpense(expenseId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExpenseModal = async () => {
    console.log('EXPENSE');
    

    setShowModal(true);
   
  };

  const handleSelection = (friend:any) => {
    if (selectedFriends.includes(friend._id)) {
      setSelectedFriends(selectedFriends.filter((id:any) => id !== friend._id));

    } else {
      setSelectedFriends([...selectedFriends, friend._id]);
      setSelectedFriendsEmail([...selectedFriendsEmail, friend.email]);
    }
  };

  const handleCalendarEvent=()=>{
     const emails = selectedFriendsEmail.map(String).join(', ');
    CalendarModule.addEvent(expens.description,location,emails)
  }

  useEffect(() => {
    dispatch(fetchExpense(expenseId));
  }, [dispatch, expenseId]);

  const handlePaymentStatus = async (participantId: any, paid: boolean) => {
    try {
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
      }, 1000);

      dispatch(updatePaymentStatus({expenseId, participantId, paid}));
      dispatch(fetchExpense(expenseId));
    } catch (error) {
      console.log('internal server error', error);
    }
  };

  return (
    <SafeAreaView style={{backgroundColor:"#D77702"}} >
      <HeaderBar title={'Expense'} />
      {ld ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View
            style={{
              borderBottomWidth: 3,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: 'silver',
              flexDirection: 'row',
              gap: 15,
              marginTop: 40,
              elevation: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            {expens && expens.type == 'group' ? (
              <MaterialIcons
                name="groups"
                size={40}
                color={'#D77702'}
                style={{marginLeft: 10}}
              />
            ) : (
              <FontAwesome6Icon
                name="money-bills"
                size={40}
                color={'#D77702'}
                style={{marginLeft: 10}}
              />
            )}

            <Text style={styles.value1}>{expens.description}</Text>
          </View>
         

          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={{flex: 1, flexDirection: 'row', gap: 8}}>
              <Text style={styles.value2}>₹{expens.amount}</Text>

              <View
                style={{elevation: 20}}>
                <Text style={styles.value}>{expens.type}</Text>
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={styles.label}>
                Paid by{' '}
                {expens.payerId._id == userId ? (
                  <Text style={{fontWeight: 'bold', color: 'black'}}>You</Text>
                ) : (
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    {expens.payerId.name}
                  </Text>
                )}{' '}
                on{' '}
              </Text>
              <Text style={styles.label}>
                {new Date(expens.date).toLocaleDateString()} at{' '}
                {new Date(expens.date).toLocaleTimeString()}{' '}
              </Text>
            </View>

            <View
              style={{flex: 1, flexDirection: 'row', gap: 20, marginTop: 20}}>
              {expens.payerId.image ? (
                <FastImage
                  source={{uri: expens.payerId.image}}
                  style={styles.image}
                />
              ) : (
                <FastImage
                  source={{
                    uri: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg',
                  }}
                  style={styles.image}
                />
              )}

              <Text style={styles.paid}>
                {expens.payerId._id == userId ? 'You' : expens.payerId.name}{' '}
                paid ₹{expens.amount}
              </Text>
            </View>
            {expens.payments.map((payment: any) => (
              <View
                key={payment.participant._id}
                style={{flexDirection: 'row'}}>
                {expens.payerId._id == userId &&
                payment.participant._id != userId ? (
                  <TouchableOpacity
                    onPress={() =>
                      handlePaymentStatus(
                        payment.participant._id,
                        !payment.paid,
                      )
                    }>
                    <View style={{width: 90}}>
                      <Text style={styles.paid3}>
                        {payment.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text> </Text>
                )}

                <Text style={styles.paid2}>
                  {payment.participant._id == userId
                    ? 'You'
                    : payment.participant.name}{' '}
                  owes ₹{payment.amount}
                </Text>
                

                {load ? (
                  <ActivityIndicator />
                ) : payment.paid && expens.payerId._id == userId ? (
                  <Text style={styles.paid4}>Paid</Text>
                ) : (
                  <Text style={styles.paid5}>Not Paid</Text>
                )}
              </View>
            ))}

            <Text style={styles.label4}>Status:</Text>
            <Text style={styles.value5}>
              {expens.settled ? 'Settled' : 'Not Settled'}
            </Text>
          </ScrollView>
          <TouchableOpacity
        style={{
          position:"absolute",
          bottom:height*0.165,
          right:width*0.06,
       
        }}
        onPress={() => handleExpenseModal()}>
          <View  style={styles.buttonContainer1} >

          <MaterialIcons name="calendar-month" size={25} color={'white'} />
          </View>
      </TouchableOpacity>
        
        </View>
        
      )}
       <Modal animationType="fade" transparent={true} visible={showModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
           
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="location-pin"
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
                placeholder="Enter Location"
                multiline
                numberOfLines={4}
                value={location}
                onChangeText={setLocation}
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
                // data={friends}
                data={friends}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.friendItem}
                    onPress={() => handleSelection(item)}>
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
              onPress={() => handleCalendarEvent()}>
              <Text style={styles.saveButtonText}>Set Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  
    </SafeAreaView>
  );
};

const {width, height} = Dimensions.get('window');

export default ExpenseScreen;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 220,
    backgroundColor:"#f5f5f5"
  },
  container: {
    padding: 16,
    paddingBottom:250,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 9,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    
    marginBottom: 5,
    fontWeight: '400',
    color: 'gray',
  },
  label2: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '400',

    color: 'gray',
  },
  label4: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '400',
    color: 'gray',
  },
  value: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D77702',
    marginBottom: 40,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray',
    borderLeftWidth: 1,
    borderRightWidth: 1.6,
    borderBottomWidth: 3,
  
  
  },
  value5: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 40,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray',
    borderLeftWidth: 1,
    borderRightWidth: 1.6,
    borderBottomWidth: 3,
  },
  value3: {
    fontSize: 16,
    borderColor: 'black',
    marginBottom: 40,
    paddingHorizontal: 5,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'gray',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'gray',
  },
  paid: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    fontWeight: '600',
  },
  paid2: {
    fontSize: 18,
    color: 'gray',
    marginTop: 8,
    marginLeft: 20,
  },
  paid3: {
    fontSize: 12,
    color: 'black',
    marginTop: 12,
    borderBottomWidth: 3,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    height: 17,
    marginLeft: 0,
    fontWeight: '500',
    textAlign: 'center',
  },
  paid4: {
    fontSize: 12,
    color: 'green',
    marginTop: 12,
    borderBottomWidth: 3,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 6,
    height: 17,
    marginLeft: 3,
    fontWeight: '500',
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 1,
  },
  paid5: {
    fontSize: 12,
    color: 'gray',
    marginTop: 12,
    borderBottomWidth: 3,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    height: 17,
    marginLeft: 3,
    fontWeight: '500',
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 1,
  },
  value1: {
    fontSize: 40,
    marginBottom: 10,
    marginTop: -6.5,

    color: 'black',
  },
  value2: {
    fontSize: 40,
    marginBottom: 10,
    marginTop: -6.5,
    marginLeft: 0,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'sans-serif',
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
  loadingContainer: {
    backgroundColor:"#f5f5f5",
    justifyContent: 'center',
    alignItems: 'center',
  },
    buttonContainer1: {
    width:width*0.15,
    backgroundColor: '#D77702',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    shadowOpacity: 2,
    shadowOffset:{height:0,width:0},
    elevation: 8,
    marginBottom:20
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
    width: 230,
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
  label1: {
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
    elevation: 10,
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOpacity: 20,
    shadowOffset:{height:0,width:0}
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
    borderWidth: 0,
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
});
