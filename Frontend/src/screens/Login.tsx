import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';

import {login} from '../redux/slices/authSlice';
import {useDispatch, useSelector} from 'react-redux';

interface LoginProps {}

const Login: React.FC<LoginProps> = props => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const dispatch = useDispatch();
  const {loading, error} = useSelector((state: any) => state.auth);

  const handleSubmit = async () => {
    console.log(email, password, '&&');
    if (email && password) {
      dispatch(login({email, password})).then((result: any) => {});
    } else {
      Alert.alert('Fill mandatory details');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior="padding">
      <SafeAreaView style={{backgroundColor:"#D77702"}}>
      <ScrollView style={{backgroundColor:"#f2f2f2",paddingBottom:795}}>
        <View>
          <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Login</Text>

            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#D77702"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Enter Your Email"
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
     
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.inBut}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.textSign}>
                {loading ? 'Loading...' : 'Log In'}
              </Text>
            </TouchableOpacity>
            <View style={{padding: 15}}>
              <Text
                style={{
                  padding: 2,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  backgroundColor: 'gray',
                  borderRadius: 12,
                }}>
                ---Or Continue as---
              </Text>
            </View>
            <View style={styles.bottomButton}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={styles.inBut2}
                  onPress={() => navigation.navigate('SignUp')}>
                  <FontAwesome
                    name="user-plus"
                    color="white"
                    style={styles.smallIcon2}
                  />
                </TouchableOpacity>
                <Text style={styles.bottomText}>Sign Up</Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 18,
                }}>
                <TouchableOpacity
                  style={styles.inBut2}
                  onPress={() => navigation.navigate('Recover')}>
                  <IonIcons
                    name="arrow-undo-outline"
                    color="white"
                    style={styles.smallIcon2}
                  />
                </TouchableOpacity>
                <Text style={styles.bottomText}>
                  <Text>Recover</Text>
                  {'\n'}
                  <Text>Account</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const {height} = Dimensions.get('window');

export default Login;

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
    color: 'gray',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
});
