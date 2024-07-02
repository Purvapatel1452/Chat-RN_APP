import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useDebugValue, useEffect, useState} from 'react';


import FriendRequest from '../components/FriendRequest';
import HeaderBar from '../components/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFriendRequests} from '../redux/slices/friendSlice';
import FastImage from 'react-native-fast-image';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';

const FriendsScreen = () => {
  const dispatch = useDispatch();
  const {userId} = useSelector((state:any) => state.auth);
  const {friendRequests, loading, error} = useSelector((state:any) => state.friend);

  const [friendRequest, setFriendRequest] = useState([]);

  useEffect(() => {
    dispatch(fetchFriendRequests(userId));
  }, []);

  return (
    <SafeAreaView style={{backgroundColor:"#D77702"}}>
    <View style={{backgroundColor:"white",paddingBottom:200}}>
      <HeaderBar title={'FriendRequest'} onIconPress={undefined} />

      {
        friendRequests.length<1 ?
        <View style={{alignSelf:"center",gap:10,}}>

        <FastImage source={{uri:"https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696458.jpg"}} style={{height:400,width:400,top:60}} />
        <Text style={{fontWeight:"bold",fontSize:38,color:"black",alignSelf:"center",top:2}}>No Requests !</Text>
      </View>
        :
      
      friendRequests.map((item: { _id: string; name: string; image: string; }, index: React.Key | null | undefined) => (
        <FriendRequest
          key={index}
          item={item}
          friendRequest={friendRequest}
          setFriendRequest={setFriendRequest}
        
        />
      ))}
    </View>
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
