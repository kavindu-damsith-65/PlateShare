import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../hooks/useAxios';

const screenWidth = Dimensions.get("window").width;

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <View className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow">
    <Text className="text-2xl font-bold text-[#00CCBB]">{value}</Text>
    <Text className="text-xs text-gray-600 mt-1">{title}</Text>
  </View>
);

// Notification Item Component
const NotificationItem = ({ message, time, icon }) => (
  <View className="flex-row items-center bg-white rounded-lg p-3 mb-3 shadow-sm">
    <View className="bg-gray-100 p-2 rounded-full mr-3">
      <Ionicons name={icon} size={20} color="#00CCBB" />
    </View>
    <View className="flex-1">
      <Text className="text-sm text-gray-800">{message}</Text>
      <Text className="text-xs text-gray-400 mt-1">{time}</Text>
    </View>
  </View>
);

// Horizontal Progress Bar Component
const ProgressBar = ({ fulfilled, pending }) => {
  const total = fulfilled + pending;
  const fulfilledPercentage = (fulfilled / total) * 100;
  const pendingPercentage = (pending / total) * 100;
  
  return (
    <View className="mt-2">
      <View className="flex-row h-4 w-full rounded-full bg-gray-200 overflow-hidden">
        <View className="bg-[#00CCBB]" style={{ width: `${fulfilledPercentage}%` }} />
        <View className="bg-yellow-400" style={{ width: `${pendingPercentage}%` }} />
      </View>
      <View className="flex-row justify-between mt-2">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-[#00CCBB] mr-1" />
          <Text className="text-xs text-gray-600">{fulfilled} Fulfilled ({fulfilledPercentage.toFixed(0)}%)</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-yellow-400 mr-1" />
          <Text className="text-xs text-gray-600">{pending} Pending ({pendingPercentage.toFixed(0)}%)</Text>
        </View>
      </View>
    </View>
  );
};

// Custom Bar Chart Component
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.values);
  
  return (
    <View className="mt-2">
      <View className="flex-row justify-between mb-6">
        {data.labels.map((label, index) => (
          <Text key={index} className="text-xs text-gray-500 flex-1 text-center">{label}</Text>
        ))}
      </View>
      <View className="flex-row justify-between h-32 items-end">
        {data.values.map((value, index) => (
          <View key={index} className="flex-1 mx-1 items-center">
            <View 
              className="bg-[#00CCBB] rounded-t-md w-8" 
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <Text className="text-xs text-gray-600 mt-1">{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function OrganizationDashboard() {
  const navigation = useNavigation();
  const axios = useAxios();
  const [stats, setStats] = useState([
    { title: "Active Requests", value: "0", icon: "clipboard-outline" },
    { title: "Donations", value: "0", icon: "gift-outline" },
    { title: "Completed", value: "0", icon: "checkmark-circle-outline" }
  ]);
  const [loading, setLoading] = useState(true);

  // Organization user ID - in a real app, this would come from authentication
  const orgUserId = "user_3";

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orgdash/stats/${orgUserId}`);
        if (response.data && response.data.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);
  
  const notifications = [
    { message: "Your request for 20 sandwiches was accepted by Tasty Bites", time: "2 hours ago", icon: "checkmark-circle-outline" },
    { message: "Fresh Harvest added 5 new food items available for donation", time: "Yesterday", icon: "fast-food-outline" },
    { message: "You claimed 10 rice packs from Spicy House", time: "2 days ago", icon: "cart-outline" },
    { message: "Your request for vegetables expires tomorrow", time: "2 days ago", icon: "alert-circle-outline" }
  ];
  
  // Weekly request data
  const weeklyRequestData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [2, 3, 1, 5, 2, 3, 1]
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Dashboard</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Welcome Section */}
        <View className="mb-5">
          <Text className="text-2xl font-semibold text-gray-800">Welcome back, Happy Elders Home 👋</Text>
          <Text className="text-sm text-gray-500 mt-1">Here's what's happening with your food requests</Text>
        </View>
        
        {/* Stats Cards */}
        <View className="flex-row justify-between mb-5">
          {loading ? (
            <View className="flex-1 items-center justify-center py-4">
              <ActivityIndicator size="large" color="#00CCBB" />
            </View>
          ) : (
            stats.map((stat, index) => (
              <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
            ))
          )}
        </View>
        
        {/* Mini Trends Section */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Activity Trends</Text>
          
          {/* Weekly Request Chart */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Weekly Request Activity</Text>
            <SimpleBarChart data={weeklyRequestData} />
          </View>
          
          {/* Request Status */}
          <View className="mb-2">
            <Text className="text-sm font-medium text-gray-700 mb-1">Request Status (This Month)</Text>
            <ProgressBar fulfilled={15} pending={5} />
          </View>
        </View>
        
        {/* Quick Actions */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Quick Actions</Text>
          
          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() => navigation.navigate('Requests')}
          >
            <Ionicons name="add-circle-outline" size={24} color="#00CCBB" />
            <Text className="text-base text-gray-800 ml-2">Create New Request</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="search-outline" size={24} color="#00CCBB" />
            <Text className="text-base text-gray-800 ml-2">Browse Available Donations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="calendar-outline" size={24} color="#00CCBB" />
            <Text className="text-base text-gray-800 ml-2">Schedule Pickup</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Activity / Notifications */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Recent Updates</Text>
            <TouchableOpacity>
              <Text className="text-sm text-[#00CCBB]">See All</Text>
            </TouchableOpacity>
          </View>
          
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem 
                key={index} 
                message={notification.message} 
                time={notification.time} 
                icon={notification.icon} 
              />
            ))
          ) : (
            <View className="items-center justify-center py-8 bg-white rounded-lg shadow">
              <Ionicons name="notifications-off-outline" size={50} color="#DDD" />
              <Text className="mt-2 text-base text-gray-500">No recent activity</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}