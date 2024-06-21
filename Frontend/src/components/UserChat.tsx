import React from 'react';
import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

interface User {
  _id: string;
  name: string;
  image: string;
  friendOwesMe: number;
  iOweFriend: number;
}

interface UserChatProps {
  item: User;
  navigateMessages: () => any;
}

const UserChat: React.FC<UserChatProps> = ({item, navigateMessages}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const netBalance = item.friendOwesMe - item.iOweFriend;
  let paymentStatusMessage = '';
  let amount = '';

  if (netBalance > 0) {
    paymentStatusMessage = `owes you `;
    amount = `₹${netBalance.toFixed(2)}`;
  } else if (netBalance < 0) {
    paymentStatusMessage = `you owe `;
    amount = `₹${Math.abs(netBalance).toFixed(2)}`;
  } else if (netBalance === 0) {
    paymentStatusMessage = `settled up`;
  }

  return (
    <Pressable onPress={navigateMessages} style={styles.pressableContainer}>
      {item.image ? (
        <FastImage source={{uri: item.image}} style={styles.image} />
      ) : (
        <FastImage
          source={{
            uri: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg',
          }}
          style={styles.image}
        />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.textName}>{item.name}</Text>
        <Text style={styles.textLast}>Last chat comes here . . . </Text>
      </View>
      <View style={styles.paymentStatusContainer}>
        <Text
          style={[
            styles.paymentStatus,
            {color: netBalance >= 0 ? 'green' : 'red'},
          ]}>
          {'    '}
          {paymentStatusMessage}
        </Text>
        <Text
          style={[
            styles.paymentStatus,
            {
              color: netBalance >= 0 ? 'green' : 'red',
              fontWeight: '500',
              fontSize: 14.5,
            },
          ]}>
          {amount}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({
  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.9,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: '#D0D0D0',
    padding: 10,
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
  paymentStatusContainer: {
    marginTop: 2,
    alignItems: 'center',
  },
  paymentStatus: {
    fontSize: 12,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
