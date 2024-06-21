import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface ExpenseItem {
  settled: any;
  _id: string;
  type: 'group' | 'non-group';
  amount: number;
  description: string;
  date: string;
}

interface ExpenseBoxProps {
  item: ExpenseItem;
}

const ExpenseBox: React.FC<ExpenseBoxProps> = ({item}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Expense', {expenseId: item._id})}
      style={styles.pressableContainer}>
      {item.type === 'group' ? (
        <MaterialIcons name="groups" size={32} color={'#D77702'} />
      ) : (
        <FontAwesome6Icon name="money-bills" size={26} color={'#D77702'} />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.textName}>₹{item.amount}</Text>
        <Text style={styles.textLast}>{item.description}</Text>
      </View>
      <View>
        <Text style={styles.textTime}>
          {new Date(item.date).toLocaleDateString()}{' '}
        </Text>
        <Text style={styles.textTime}>
          {item.settled ? 'Settled' : 'Not Settled'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExpenseBox;

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
    fontSize: 16,
    color: 'black',
  },
  textLast: {
    color: 'gray',
    fontWeight: '500',
  },
  textTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#585858',
  },
});
