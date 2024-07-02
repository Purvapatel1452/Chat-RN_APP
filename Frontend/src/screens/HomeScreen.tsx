import React, {
  useLayoutEffect,
  useContext,
  useEffect,
  useState,
  useId,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {NavigationProp, useNavigation} from '@react-navigation/native';

import User from '../components/User';

import HeaderBar from '../components/HeaderBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fetchUserDetails, fetchUsers} from '../redux/slices/usersSlice';

const HomeScreen = () => {
  console.log('PNP');

  const dispatch = useDispatch();

  const {userId} = useSelector((state:any) => state.auth);

  const {users, loading, error} = useSelector((state:any) => state.users);

  useEffect(() => {
    if (userId) {
      // dispatch(fetchUserDetails(userId))
      dispatch(fetchUserDetails(userId));
      dispatch(fetchUsers(userId));

      console.log(users, ':>>>>>>');
    }
  }, [dispatch, userId]);

  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:"#D77702"}} >
    
      <HeaderBar title={'AddFriends'} />

      <ScrollView style={{backgroundColor:"white"}}>
        <View style={styles.userContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : error ? (
            <Text>Error: {error}</Text>
          ) : (
            users.map((item: any, index: any) => (
              <User key={index} item={item} />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{position: 'relative'}}
        onPress={() => navigation.navigate('Friends')}>
        <View style={styles.buttonContainer2}>
          <MaterialIcons
            name="notifications-active"
            size={25}
            color={'white'}
          />
        </View>
      </TouchableOpacity>
    
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  leftText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  userContainer: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top:300
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
    shadowOffset: {width: 0.1, height: 1},
    shadowOpacity: 10,
    elevation: 8,
  },
});
