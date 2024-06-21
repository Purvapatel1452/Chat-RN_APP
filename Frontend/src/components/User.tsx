import React, {useEffect, useState} from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  checkFriendRequest,
  sendFriendRequest,
} from '../redux/slices/friendSlice';
import FastImage from 'react-native-fast-image';
import {fetchUserDetails} from '../redux/slices/usersSlice';

interface UserProps {
  item: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
}

const User: React.FC<UserProps> = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const {userId} = useSelector((state: any) => state.auth);

  const {details, loading, error} = useSelector((state: any) => state.users);
  const [load, setLoad] = useState(true);

  const sendFriendRequests = async () => {
    try {
      dispatch(
        sendFriendRequest({currentUserId: userId, selectedUserId: item._id}),
      );
      setTimeout(() => {
        dispatch(fetchUserDetails(userId));
      }, 800);
    } catch (err) {
      console.log('Error in handling send Request', err);
    }
  };

  return (
    <Pressable style={styles.pressableContainer}>
      <View>
        {item.image ? (
          <FastImage style={styles.image} source={{uri: item.image}} />
        ) : (
          <FastImage
            source={{
              uri: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg',
            }}
            style={styles.image}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>{item?.name}</Text>
        <Text style={styles.textEmail}>{item?.email}</Text>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : details?.sentFriendRequests?.includes(item._id) ? (
        <Pressable
          style={styles.pressAddFrnd1}
          onPress={() => {
            Alert.alert('Request Already Sent !!!');
          }}>
          <Text style={styles.textAdd1}>Request Sent</Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.pressAddFrnd}
          onPress={() => {
            console.log('request send', item._id);
            sendFriendRequests();
          }}>
          <Text style={styles.textAdd}>Add Friend</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({
  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  textName: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 15,
  },
  textEmail: {
    color: 'gray',
    marginTop: 4,
  },
  pressAddFrnd: {
    backgroundColor: '#567189',
    padding: 10,
    borderRadius: 8,
    width: 105,
  },
  pressAddFrnd1: {
    backgroundColor: '#8BC34A',
    padding: 10,
    borderRadius: 8,
    width: 105,
  },
  textAdd: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
  },
  textAdd1: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
  },
});
