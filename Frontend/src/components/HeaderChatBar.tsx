import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchGroupData} from '../redux/slices/groupSlice';
import {fetchRecepientData} from '../redux/slices/recepientSlice';
import FastImage from 'react-native-fast-image';

const HeaderChatBar = ({title, id}: any) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const {groupData, groupLoading, groupError} = useSelector(
    (state: any) => state.group,
  );
  const {recepientDatas, recepientLoading, recepientError} = useSelector(
    (state: any) => state.recepient,
  );

  useEffect(() => {
    setIsLoading(true);
    if (title === 'GroupChatScreen') {
      dispatch(fetchGroupData(id));
    } else if (title === 'ChatMessageScreen') {
      dispatch(fetchRecepientData(id));
    }
    setTimeout(() => setIsLoading(false), 2000);
  }, [dispatch, id, title]);

  const truncateText = (text: string, limit: number) =>
    text.length <= limit ? text : `${text.substring(0, limit)}...`;

  const concatenateMemberNames = (members: any, limit: number) => {
    let concatenated = '';
    let totalLength = 0;

    for (let member of members) {
      const nameLength = member.name.length;

      if (totalLength + nameLength + 2 > limit) {
        concatenated += '...';
        break;
      }

      concatenated += (totalLength === 0 ? '' : ', ') + member.name;
      totalLength += nameLength + 2;
    }

    return concatenated;
  };

  const renderIcon = () => {
    if (title === 'GroupChatScreen' && groupData) {
      return (
        <>
          {groupLoading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('GroupChatProfile', {groupId: id})
              }>
              <View style={styles.imageContainer}>
                <FastImage
                  source={{uri: groupData.image}}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          )}
          {groupLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              <Text style={styles.headerText}>
                {truncateText(groupData.name, 16)}
              </Text>
              <View style={styles.listContainer}>
                <View style={styles.container}>
                  <Text style={styles.desc}>
                    {concatenateMemberNames(groupData.members, 45)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      );
    } else if (title === 'ChatMessageScreen' && id) {
      return (
        <>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserProfile', {recepientId: id})
              }>
              <View style={styles.imageContainer}>
                {recepientDatas.image ? (
                  <FastImage
                    source={{uri: recepientDatas.image}}
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
              </View>
            </TouchableOpacity>
          )}
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              <Text style={styles.headerText}>
                {truncateText(recepientDatas.name, 16)}
              </Text>
              <Text style={styles.desc}>
                {truncateText(recepientDatas.email, 32)}
              </Text>
            </View>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.headerContainerGroup}>
      <IonIcons
        name="arrow-back-sharp"
        size={28}
        color={'white'}
        onPress={() => navigation.goBack()}
      />
      {renderIcon()}
    </View>
  );
};

const {width, height} = Dimensions.get('window');

export default HeaderChatBar;

const styles = StyleSheet.create({
  headerContainerGroup: {
    backgroundColor: '#D77702',
    position: 'relative',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomStartRadius: 1,
    borderBottomEndRadius: 1,
    borderColor: 'silver',
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 10,
    gap: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500',
    top: -height * 0.01,
  },
  desc: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    left: width * 0.00233,
    top: -height * 0.008,
  },
  imageContainer: {
    height: 45,
    width: 45,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOpacity: 10,
    elevation: 5,
  },
  image: {
    height: 45,
    width: 45,
  },
  listContainer: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -height * 0.008,
  },
  memberName: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
});
