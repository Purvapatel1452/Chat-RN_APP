import React, {useEffect, useState} from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserDetails} from '../redux/slices/usersSlice';

import FastImage from 'react-native-fast-image';

interface UserDetails {
  image: string;
  // Add other properties if necessary
}

const ProfilePic: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  const {userId} = useSelector((state: any) => state.auth);
  const {details, loading, error} = useSelector((state: any) => state.users);
  const [isLoading,setIsLoading]=useState(true)

  useEffect(() => {
    dispatch(fetchUserDetails(userId));
    setTimeout(()=>{
      setIsLoading(false)
    },1500)
  }, [dispatch, userId]);

  if (loading) {
    return <ActivityIndicator size="small" color="silver" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Profile', {data: details})}>
      <View style={styles.imageContainer}>
        {isLoading ?
        <ActivityIndicator size="small" color="silver" />
        :
        
        details.image ? (
          <FastImage source={{uri: details.image}} style={styles.image} />
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
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    height: height * 0.038,
    width: height * 0.037,
    borderRadius: 12,
    borderColor: 'silver',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOpacity: 10,
    elevation: 5,
  },
  image: {
    height: 36,
    width: 36,
  },
});

export default ProfilePic;
