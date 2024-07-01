import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';

import {login} from '../redux/slices/authSlice';
import {useDispatch, useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/Feather';
import {BASE_URL} from '@env';
import axios from 'axios';
import {fetchUserDetails} from '../redux/slices/usersSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps {}

const RecoverScreen: React.FC<LoginProps> = props => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const dispatch = useDispatch();
  const {userId,loading, error} = useSelector((state: any) => state.auth);

  const getToken = async () => {
    return await AsyncStorage.getItem('authToken');
  };
  const handleRecoverAccount = async () => {
    try {
      console.log(BASE_URL, 'BAer4gfy3r34fSEE', email, password);
      const token = getToken();
      const response = await axios.post(
        `${BASE_URL}/user/recoverUser`,
        {email, password},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        Alert.alert('Account recovered successfully!');
        dispatch(fetchUserDetails(userId));
        setEmail('');
        setPassword('');
        navigation.navigate('Login')
      } else {
        Alert.alert('Failed to recover account');
      }
    } catch (error) {
      console.log('Error recovering account:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior="padding">
      <StatusBar backgroundColor={'#D77702'} />
      <View style={styles.iconContainer2}>
        <IonIcons
          name="arrow-back-sharp"
          size={30}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={{}}>
        <View>
          <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Account Recovery</Text>

            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#D77702"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Email"
                style={styles.textInput}
                onChangeText={e => setEmail(e)}
                placeholderTextColor={'gray'}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome
                name="lock"
                color="#D77702"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Password"
                style={styles.textInput}
                onChangeText={e => setPassword(e)}
                secureTextEntry={showPassword}
                placeholderTextColor={'gray'}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? (
                  <Text></Text>
                ) : !showPassword ? (
                  <Feather
                    name="eye-off"
                    color={'green'}
                    size={23}
                    style={{marginRight: -6}}
                  />
                ) : (
                  <Feather
                    name="eye"
                    color={'green'}
                    size={23}
                    style={{marginRight: -6}}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginLeft: 140,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginTop: 8,
                marginRight: 10,
              }}>
              {/* <Text style={{ color: 'gray', fontWeight: '700' }}>
                Forgot Password
              </Text> */}
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.inBut}
              onPress={() => handleRecoverAccount()}
              disabled={loading}>
              <Text style={styles.textSign}>
                {loading ? ' Recovering...' : 'Recover'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const {height} = Dimensions.get('window');

export default RecoverScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'silver',
    flex: 1,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 260,
    width: 260,
    marginTop: 30,
  },
  text_footer: {
    color: '#D77702',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D77702',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    color: '#05375a',
  },
  loginContainer: {
    width: 320,
    marginTop: height * 0.25,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 10,
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  text_header: {
    color: '#D77702',
    fontWeight: 'bold',
    fontSize: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
    textAlign: 'center',
    margin: 20,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#D77702',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 10,
  },
  inBut2: {
    backgroundColor: '#D77702',
    height: 65,
    width: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 10,
  },
  bottomButton: {
    marginTop: 10,
    width: '45%',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: 'black',
    flexDirection: 'row',
  },
  smallIcon2: {
    fontSize: 40,
  },
  bottomText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  iconContainer2: {
    top: 15,
    left: 15,
  },
});
