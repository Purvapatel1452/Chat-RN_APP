import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  Dimensions,
  Easing,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  PlatformPay,
  PlatformPayButton,
  confirmPlatformPayPayment,
  useStripe,
} from '@stripe/stripe-react-native';
import HeaderBar from '../components/HeaderBar';
import {
  createPaymentIntent,
  fetchPaymentIntent,
} from '../redux/slices/paymentSlice';
import {
  fetchUserSubscription,
  updateUserSubscription,
} from '../redux/slices/subscriptionSlice';
type BillingAddressFormat = 'MIN' | 'MAX'|'FULL';
const PaymentScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSlideAnim] = useState(new Animated.Value(0));
  const [load,setLoad]=useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false);

  const dispatch = useDispatch();
  const {userId} = useSelector((state: any) => state.auth);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {
    paymentIntentClientSecret,
    loading: paymentLoading,
    error: paymentError,
  } = useSelector((state: any) => state.payment);
  const {
    subscription,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSelector((state: any) => state.sub);

  const plans = [
    {type: 'Monthly', price: 99, details: '30 days'},
    {type: 'Quarterly', price: 199, details: '90 days'},
    {type: 'Yearly', price: 699, details: '360 days'},
  ];

  const checkSubscription = async () => {
    dispatch(fetchUserSubscription(userId));
    const currentDate = new Date();
    const subscriptionEndDate = new Date(subscription.subscriptionEndDate);

    if (
      subscription &&
      subscriptionEndDate.getTime() >= currentDate.getTime()
    ) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [dispatch, userId,setTimeout]);

  const handlePlanSelection = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleSubscription = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan.');
      return;
    }

    try {
      await dispatch(fetchPaymentIntent({amount: selectedPlan.price * 100}));

      const {error} = await initPaymentSheet({
        paymentIntentClientSecret,
        merchantDisplayName: 'Your Company',
        defaultBillingDetails: {name: 'Customer Name'},
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      const {error: paymentError} = await presentPaymentSheet();
      if (paymentError) {
        Alert.alert('Error', paymentError.message);
      } else {
        Alert.alert('Success', 'Payment successful');
        console.log('SUUNNBB');
        dispatch(
          updateUserSubscription({userId, subscriptionType: selectedPlan.type}),
        );
        setTimeout(() => {
          checkSubscription();
        }, 2000);
        setLoad(true)
        setTimeout(()=>{
          setLoad(false)
        },2000)
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      Alert.alert('Error', err.message);
    }
  };

  const handlePlatformPay = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan.');
      return;
    }

    try {
      dispatch(createPaymentIntent({amount: selectedPlan.price * 100}));

      const {error} = await confirmPlatformPayPayment(
        paymentIntentClientSecret,
        {
          googlePay: {
            testEnv: true,
            merchantName: 'Your Company',
            merchantCountryCode: 'INR',
            currencyCode: 'INR',
            billingAddressConfig: {
              isPhoneNumberRequired: true,
              isRequired: true,
            },
          },
        },
      );

      if (error) {
        Alert.alert(error.code, error.message);
      } else {
        Alert.alert('Success', 'The payment was confirmed successfully.');
        dispatch(
          updateUserSubscription({userId, subscriptionType: selectedPlan.type}),
        );
      }
    } catch (err: any) {
      console.error('Platform Pay error:', err);
      Alert.alert('Error', err.message);
    }
  };

  const openURL = (url: any) => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log(`Don't know how to open URI: ${url}`);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    Animated.timing(modalSlideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const modalSlideUp = modalSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0],
  });

  // console.log(isSubscribed,"::",subscription.subscriptionType,plans.type)

  return (
    <>
      <HeaderBar title="Subscription" />
      <View style={styles.mainContainer}>
        {
          load ?
          <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        :
        <ScrollView contentContainerStyle={styles.scrollView}>
          {plans.map(plan => (
            <Pressable
              key={plan.type}
              style={[
                styles.subscriptionCardView,
                selectedPlan?.type === plan.type && styles.isSelected,
                plan.type == subscription.subscriptionType &&
                  styles.subscribedBannerCard,
              ]}
              onPress={() => handlePlanSelection(plan)}
              disabled={plan.type == subscription.subscriptionType}>
              {isSubscribed && plan.type == subscription.subscriptionType ? (
                <View style={styles.container}>
                  <View style={styles.banner}>
                    <Text style={styles.bannerText}>subscribed</Text>
                  </View>
                </View>
              ) : null}

              <View
                style={[
                  styles.subscriptionCardDataView,
                  plan.type == subscription.subscriptionType &&
                    styles.subscribedBanner,
                ]}>
                <Text style={styles.subscriptionCardTypeText}>{plan.type}</Text>
                <Text style={styles.subscriptionCardTypePrice}>
                  ₹{plan.price}
                </Text>
              </View>
              <View style={styles.subscriptionCardDetailsView}>
                <Text style={styles.subscriptionCardDetailsMessage}>
                  {plan.details}
                </Text>
              </View>

              {selectedPlan?.type === plan.type && (
                <TouchableOpacity
                  onPress={handleOpenModal}
                  style={[styles.subscriptionCardBtnView]}>
                  <Text style={styles.subscriptionCardBtnText}>
                    Subscribe Now
                  </Text>
                </TouchableOpacity>
              )}
            </Pressable>
          ))}
        </ScrollView>
          
        }
        

        <Modal visible={modalVisible} transparent animationType="none">
          <Animated.View
            style={[
              styles.modalContainer,
              {transform: [{translateY: modalSlideUp}]},
            ]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose a Payment Method</Text>
              <View>
                <Button
                  title="Pay"
                  onPress={handleSubscription}
                  disabled={paymentLoading || subscriptionLoading}
                />
              </View>
              <View>
                <PlatformPayButton
                  type={PlatformPay.ButtonType.Pay}
                  onPress={handlePlatformPay}
                  style={styles.platformPayButton}
                />
              </View>
              <Button title="Cancel" onPress={handleCloseModal} />
            </View>
          </Animated.View>
        </Modal>
      </View>
    </>
  );
};
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ff',
  },
  scrollView: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionCard: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 5,
    width: width * 0.85,
    height: height * 0.15,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 20,
  },
  selectedSubscriptionCard: {
    backgroundColor: '#d5e8d4',
  },
  subscriptionCardType: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  subscriptionCardPrice: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
  platformPayButton: {
    width: '100%',
    height: 70,
    marginTop: 10,
  },

  subscriptionCardView: {
    backgroundColor: '#f5f5f5',
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    gap: 10,
    marginBottom: 15,
    borderColor: 'white',
    borderWidth: 3,

    width: width * 0.85,
    alignSelf: 'center',
  },
  subscriptionCardDataView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscriptionCardTypeText: {
    fontSize: 28,
    color: 'black',
  },
  subscriptionCardTypePrice: {
    fontSize: 28,
    color: 'black',
  },
  subscriptionCardDetailsView: {
    marginTop: -5,
  },
  subscriptionCardDetailsMessage: {
    fontWeight: '500',
  },
  subscriptionCardBtnView: {
    marginTop: 10,
    backgroundColor: '#bf1234',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionCardBtnText: {
    color: 'white',
    fontSize: 19,
  },
  isSelected: {
    borderColor: '#bf1234',
    borderWidth: 2.5,
  },
  isNotSelected: {
    backgroundColor: 'gray',
  },
  subscribedBanner: {
    paddingTop: 10,
  },
  subscribedBannerCard: {
    borderColor: 'white',
  },

  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.3,
    height: height * 0.1,
    overflow: 'hidden',
    transform: [{rotate: '360deg'}],
  },
  banner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default PaymentScreen;
