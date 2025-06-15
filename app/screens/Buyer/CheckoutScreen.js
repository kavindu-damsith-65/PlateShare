import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import useAxios from '../../hooks/useAxios';

export default function CheckoutScreen({ route, navigation }) {
  const { user_id, id } = route.params;
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);
  const axios = useAxios();

  const fetchPaymentIntent = async () => {
    try {
      const response = await axios.post('/api/payment/create-payment-intent', {
        user_id,
        id,
      });
      setClientSecret(response.data.clientSecret);
      console.log('Payment Intent fetched:', response.data);
    } catch (error) {
      console.error('Payment Intent error:', error);
      Alert.alert('Error', 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentIntent();
  }, []);

  useEffect(() => {
    const initializePaymentSheet = async () => {
      if (!clientSecret) return;

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'PlateShare',
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'PlateShare Customer',
        },
      });

      if (error) {
        console.error('Payment Sheet initialization error:', error);
        Alert.alert('Error', 'Failed to initialize payment sheet');
      } else {
        setPaymentSheetReady(true);
        console.log('Payment Sheet initialized successfully');
      }
    };

    initializePaymentSheet();
  }, [clientSecret]);

  const handlePayment = async () => {
    if (!paymentSheetReady) {
      Alert.alert('Error', 'Payment sheet not ready');
      return;
    }

    const { error } = await presentPaymentSheet();

    if (error) {
      console.error('Payment error:', error);
      if (error.code === 'Canceled') {
        console.log('Payment cancelled by user');
      } else {
        Alert.alert('Payment Failed', error.message);
      }
    } else {
      Alert.alert(
        'Payment Successful!',
        'Your payment has been processed successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Prepare'),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        backgroundColor: 'white'
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
            backgroundColor: '#f3f4f6',
            borderRadius: 20,
            marginRight: 12
          }}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
          Payment
        </Text>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00CCBB" />
          <Text style={{ marginTop: 16, color: '#6b7280' }}>
            Initializing payment...
          </Text>
        </View>
      ) : !paymentSheetReady ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ef4444', marginBottom: 20, fontSize: 16 }}>
            Payment initialization failed. Please try again.
          </Text>
          <TouchableOpacity
            onPress={fetchPaymentIntent}
            style={{
              backgroundColor: '#00CCBB',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{
            backgroundColor: '#f8fafc',
            padding: 30,
            borderRadius: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: 12,
              textAlign: 'center'
            }}>
              Complete Your Payment
            </Text>

            <Text style={{
              fontSize: 14,
              color: '#6b7280',
              marginBottom: 24,
              textAlign: 'center',
              lineHeight: 20
            }}>
              Tap the button below to open the secure payment sheet and complete your order.
            </Text>

            <TouchableOpacity
              onPress={handlePayment}
              style={{
                backgroundColor: '#00CCBB',
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 12,
                shadowColor: '#00CCBB',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5
              }}
            >
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16
              }}>
                Pay Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}