import React from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Requests from '../../components/organisation/Requests';

export default function OrganizationRequests() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      <Requests />
    </SafeAreaView>
  );
}
