import {
  Alert,
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Error from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {
  registerUser,
  sendOtp,
  setUserData,
  toggleShowOtpInput,
  verifyFields,
  verifyOtp,
} from '../redux/slices/signUpSlice';

import {TouchableOpacity} from 'react-native';
import { getToken } from '../../NotificationService';

const SignUp = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const dispatch = useDispatch();

  const {
    userData,
    nameVerify,
    emailVerify,
    mobileVerify,
    passwordVerify,
    otpVerify,
    showOtpInput,
    error,
    loading,
  } = useSelector((state: any) => state.signUp);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    // Fetch and set the FCM token on component mount
    async function fetchFcmToken() {
      const fcmToken = await getToken();
      dispatch(setUserData({ fcmToken }));
    }

    fetchFcmToken();
  }, [dispatch]);
  const handleChange = (field: string, value: string) => {
    console.log(field,"???:::???",value)
    dispatch(setUserData({[field]: value}));
    dispatch(verifyFields());
  };

  const handlesendOtp = () => {
    if (emailVerify) {
      console.log('+++++++', emailVerify);
      dispatch(sendOtp(userData.email));
    } else {
      Alert.alert(
        'Invalid Email',
        'Please enter valid email address to send Otp',
      );
    }
  };

  const handleVerifyOtp = () => {
    dispatch(verifyOtp({email: userData.email, otp: userData.otp}));
  };

  async function handleSubmit() {
    if (nameVerify && emailVerify && passwordVerify && mobileVerify) {
      const fcmToken=await getToken()

     
      if (otpVerify) {
   

  dispatch(registerUser(userData)).then((result: any) => {
    if (registerUser.fulfilled.match(result)) {
      Alert.alert('Registration Successfull');
      navigation.navigate('Login');
    } else if (registerUser.rejected.match(result)) {
      Alert.alert('Registration Failed', result.payload);
    }
    setIsEditable(true);
    console.log(isEditable, 'EEEEEEEEEEEEEEEEEEEEE');
    dispatch(
      setUserData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        otp: '',
        fcmToken:''
      }),
    );
  });


       
        
      } else {
        Alert.alert(
          'Email Verification',
          'Please verify your email before registering',
        );
      }
    } else {
      Alert.alert(
        'Invalid Details',
        'Please fill in all mandatory details correctly',
      );
    }
  }

  useEffect(() => {
    if (otpVerify) {
      setIsEditable(false);
      console.log(isEditable);
    }
  }, [handleVerifyOtp]);

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior="padding">
      <StatusBar backgroundColor={'#D77702'} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View>
          <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Register</Text>

            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#D77702"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Name"
                style={styles.textInput}
                onChangeText={value => handleChange('name', value)}
                value={userData.name}
                placeholderTextColor={'gray'}
              />
              {userData.name.length < 1 ? null : nameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
            </View>
            {userData.name.length < 1 ? null : nameVerify ? null : (
              <Text
                style={{
                  fontSize: 12,
                  color: 'red',
                }}>
                Name should be more than 1 characters.
              </Text>
            )}
            <View style={styles.action}>
              <MaterialCommunityIcons
                name="email-outline"
                color="#D77702"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Email"
                style={styles.textInput}
                onChangeText={value => handleChange('email', value)}
                value={userData.email}
                placeholderTextColor={'gray'}
                editable={isEditable}
              />
              {userData.email.length < 1 ? null : otpVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : emailVerify ? (
                <View style={styles.button1}>
                  <TouchableOpacity
                    style={styles.inBut1}
                    onPress={() => handlesendOtp()}>
                    <Text style={styles.textSign1}>Verify</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Error name="error" color="red" size={20} />
              )}
            </View>
            {userData.email.length < 1 ? null : emailVerify ? null : (
              <Text
                style={{
                  fontSize: 12,
                  marginRight: 90,
                  color: 'red',
                }}>
                Enter Proper Email Address
              </Text>
            )}
            {showOtpInput && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={showOtpInput}
                  onRequestClose={() => dispatch(toggleShowOtpInput())}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        margin: 10,
                        width: 300,
                        gap: 10,
                      }}>
                      <TextInput
                        placeholder="OTP"
                        onChangeText={value => handleChange('otp', value)}
                        value={userData.otp}
                        style={{
                          borderColor: '#D77702',
                          borderWidth: 1,
                          borderRadius: 30,
                          padding: 5,
                          paddingLeft: 10,
                        }}
                      />

                      <Button
                        title="Verify OTP"
                        onPress={() => handleVerifyOtp()}
                      />

                      <Button
                        title="Close"
                        onPress={() => dispatch(toggleShowOtpInput())}
                      />
                    </View>
                  </View>
                </Modal>
              </View>
            )}
            <View style={styles.action}>
              <FontAwesome name="mobile" color="#D77702" style={styles.Icon} />
              <TextInput
                placeholder="Mobile"
                style={styles.textInput}
                keyboardType="phone-pad"
                onChangeText={value => handleChange('mobile', value)}
                value={userData.mobile}
                maxLength={10}
                placeholderTextColor={'gray'}
              />
              {userData.mobile.length < 1 ? null : mobileVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
            </View>
            {userData.mobile.length < 1 ? null : mobileVerify ? null : (
              <Text
                style={{
                  fontSize: 12,
                  marginRight: 90,
                  color: 'red',
                }}>
                Enter proper mobile number between 0-9 (10 digits)
              </Text>
            )}
            <View style={styles.action}>
              <FontAwesome
                name="lock"
                color="#D77702"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Password"
                style={styles.textInput}
                onChangeText={value => handleChange('password', value)}
                value={userData.password}
                secureTextEntry={!showPassword}
                placeholderTextColor={'gray'}
              />

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowPassword(!showPassword)}>
                {userData.password.length < 1 ? (
                  <Text></Text>
                ) : showPassword ? (
                  <Feather
                    name="eye-off"
                    color={passwordVerify ? 'green' : 'red'}
                    size={23}
                    style={{marginRight: -6}}
                  />
                ) : (
                  <Feather
                    name="eye"
                    color={passwordVerify ? 'green' : 'red'}
                    size={23}
                    style={{marginRight: -6}}
                  />
                )}
              </TouchableOpacity>
            </View>
            {userData.password.length < 1 ? (
              <Text></Text>
            ) : passwordVerify ? (
              <Text></Text>
            ) : (
              <Text
                style={{
                  marginLeft: 20,
                  color: 'red',
                }}>
                Uppercase, Lowercase, Number, and 6 more Character
              </Text>
            )}
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.inBut}
              onPress={() => handleSubmit()}>
              <Text style={styles.textSign}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={{padding: 15, width: 250, alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{backgroundColor: 'gray', borderRadius: 20}}>
              <Text style={styles.already}>Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const {height} = Dimensions.get('window');

export default SignUp;

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
  textSign1: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: 'white',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  Icon: {
    marginLeft: 3,
    marginRight: 15,
    fontSize: 30,
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
    color: '#05375a',
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
    marginTop: height * 0.18,
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
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    textAlign: 'center',
    paddingLeft: 4,
    marginTop: -9,
    marginLeft: 9,
    marginRight: -18,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#D77702',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 20,
  },
  inBut1: {
    width: '70%',
    backgroundColor: '#D77702',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
  },
  inBut2: {
    backgroundColor: '#D77702',
    height: 65,
    width: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  already: {
    padding: 2,
    color: 'blue',
    fontWeight: '500',
    fontSize: 14,
    backgroundColor: 'white',
    borderRadius: 12,
    textAlign: 'center',
    elevation: 3,
  },
});
