import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Currency from "react-currency-formatter";
import useAxios from '../../hooks/useAxios';

export default function CheckoutScreen({ route, navigation }) {
  const { user_id, id } = route.params;
  const [clientSecret, setClientSecret] = useState(null);
  const [foodBucket, setFoodBucket] = useState(null);
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
      setFoodBucket(response.data.foodBucket);
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

    const { error } = await presentPaymentSheet(); if (error) {
      console.error('Payment error:', error);
      if (error.code === 'Canceled') {
        console.log('Payment cancelled by user');
        Alert.alert(
          'Payment Cancelled',
          'Your payment was cancelled. You can try again or go back to modify your order.',
          [
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
            }
          ]
        );
      } else {
        Alert.alert(
          'Payment Failed',
          'There was an error processing your payment. Please try again or go back.',
          [
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
            }
          ]
        );
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
        </View>) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
              Order Summary
            </Text>

            {/* Products List */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3
            }}>
              {foodBucket?.products?.map((product, index) => (
                <View key={product.id} style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  borderBottomWidth: index < foodBucket.products.length - 1 ? 1 : 0,
                  borderBottomColor: '#f3f4f6'
                }}>
                  <Image
                    source={{ uri: product.image }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: '#f3f4f6'
                    }}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
                      {product.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                      {product.description}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>
                        Qty: {product.quantity}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#00CCBB' }}>
                        <Currency quantity={product.subtotal} currency="LKR" />
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Total Section */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>Subtotal</Text>
                <Text style={{ fontSize: 16, color: '#1f2937' }}>
                  <Currency quantity={foodBucket?.total_price || 0} currency="LKR" />
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>Delivery Fee</Text>
                <Text style={{ fontSize: 16, color: '#1f2937' }}>Free</Text>
              </View>
              <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>Total</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00CCBB' }}>
                  <Currency quantity={foodBucket?.total_price || 0} currency="LKR" />
                </Text>
              </View>
            </View>

            {/* Payment Button */}
            <TouchableOpacity
              onPress={handlePayment}
              style={{
                backgroundColor: '#00CCBB',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
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
                fontSize: 18
              }}>
                Pay <Currency quantity={foodBucket?.total_price || 0} currency="LKR" />
              </Text>
            </TouchableOpacity>

            <Text style={{
              fontSize: 12,
              color: '#6b7280',
              textAlign: 'center',
              marginTop: 12,
              lineHeight: 18
            }}>
              By proceeding, you agree to our terms and conditions. Your payment is secured by Stripe.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}