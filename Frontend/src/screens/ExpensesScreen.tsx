import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import HeaderBar from '../components/HeaderBar';
import ExpenseBox from '../components/ExpenseBox';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {fetchExpenses} from '../redux/slices/expensesSlice';
import FastImage from 'react-native-fast-image';

const ExpensesScreen = () => {
  const {userId} = useSelector((state: any) => state.auth);
  const {expenses, loading, error} = useSelector(
    (state: any) => state.expenses,
  );

  const dispatch = useDispatch();

  const [isType, setIsType] = useState(false);
  const [expenseType, setExpenseType] = useState('');

  const navigation = useNavigation();

  const handleExpenses = async (expenseType: any) => {
    try {
      console.log('ECXOPES');
      console.log('type', expenseType);
      let type = '';

      dispatch(fetchExpenses({userId, type: expenseType}));
    } catch (error) {
      console.log('Error in internal server:', error);
    }
  };

  const groupExpenses = async (expenseType: any) => {
    try {
      console.log('ECXOPES');
      console.log('type', expenseType);

      dispatch(fetchExpenses({userId, expenseType}));
    } catch (error) {
      console.log('Error in internal server:', error);
    }
  };

  useEffect(() => {
    handleExpenses('non-settled');
  }, []);

  return (

    <SafeAreaView style={{backgroundColor:'#D77702'}}>
      <StatusBar backgroundColor={'#D77702'} />

      <HeaderBar title={'ExpensesScreen'} />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{backgroundColor: 'white'}}>
        <View style={styles.pressableContainer}>
          <TouchableOpacity onPress={() => handleExpenses('non-settled')}>
            <View style={styles.pressableContainer2}>
              <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
                All Expenses
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => groupExpenses('group')}>
            <View style={styles.pressableContainer1}>
              <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
                Group Expenses
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => groupExpenses('non-group')}>
            <View style={styles.pressableContainer2}>
              <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
                Non-group Expenses
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleExpenses('settled')}>
            <View style={styles.pressableContainer2}>
              <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
                Settled Expenses
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ScrollView style={{backgroundColor: 'white', height: 800}}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : expenses.length < 1 ? (
          <View style={{alignSelf: 'center', gap: 10}}>
            <FastImage
              source={{
                uri: 'https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696458.jpg',
              }}
              style={{height: 400, width: 400, top: 60}}
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 38,
                color: 'black',
                alignSelf: 'center',
                top: 2,
              }}>
              No Expenses !
            </Text>
          </View>
        ) : (
          <View style={{marginBottom: 300}}>
            {expenses.map((item: any, index: React.Key | null | undefined) => (
              <ExpenseBox key={index} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    
    </SafeAreaView>
  );
};

export default ExpensesScreen;

const styles = StyleSheet.create({
  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.9,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    padding: 6,
    justifyContent: 'center',
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    top: 100,
    height: 400,
  },
  pressableContainer1: {
    alignItems: 'center',
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    borderRadius: 10,
    borderColor: '#D77702',
    padding: 3,
    textAlign: 'center',
    justifyContent: 'center',

    marginTop: -19,
    marginBottom: -10,
    width: 160,
    height: 40,
  },
  pressableContainer2: {
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#D77702',
    padding: 3,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: -19,
    marginBottom: -10,
    width: 160,
    height: 40,
  },
});
