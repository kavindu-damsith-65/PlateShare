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
  const [weeklyRequestData, setWeeklyRequestData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [0, 0, 0, 0, 0, 0, 0]
  });
  const [requestStatus, setRequestStatus] = useState({
    fulfilled: 0,
    pending: 0
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [orgName, setOrgName] = useState(""); // Add state for organization name

  // Organization user ID - in a real app, this would come from authentication
  const orgUserId = "user_3";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch organization details to get the name
        const orgResponse = await axios.get(`/api/user/organization/${orgUserId}`);
        if (orgResponse.data && orgResponse.data.organization) {
          setOrgName(orgResponse.data.organization.user.name);
        }
        
        // Fetch all data in parallel
        const [statsResponse, weeklyResponse, statusResponse, updatesResponse] = await Promise.all([
          axios.get(`/api/orgdash/stats/${orgUserId}`),
          axios.get(`/api/orgdash/weekly-activity/${orgUserId}`),
          axios.get(`/api/orgdash/request-status/${orgUserId}`),
          axios.get(`/api/orgdash/recent-updates/${orgUserId}`)
        ]);

        // Update state with fetched data
        if (statsResponse.data && statsResponse.data.stats) {
          setStats(statsResponse.data.stats);
        }

        if (weeklyResponse.data && weeklyResponse.data.weeklyRequestData) {
          setWeeklyRequestData(weeklyResponse.data.weeklyRequestData);
        }

        if (statusResponse.data && statusResponse.data.requestStatus) {
          setRequestStatus(statusResponse.data.requestStatus);
        }

        if (updatesResponse.data && updatesResponse.data.updates) {
          setRecentUpdates(updatesResponse.data.updates);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);  
  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <StatusBar style="dark" />
      
      <View className="px-5 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Dashboard</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
         {/* Welcome Section */}
        <View className="mb-5">
          {loading ? (
            <>
              <View className="h-8 w-3/4 bg-gray-200 rounded mb-2" />
              <View className="h-4 w-full bg-gray-200 rounded" />
            </>
          ) : (
            <>
              <Text className="text-2xl font-semibold text-gray-800">Welcome back, {orgName} 👋</Text>
              <Text className="text-sm text-gray-500 mt-1">Here's what's happening with your food requests</Text>
            </>
          )}
        </View>
        
        {/* Stats Cards */}
        <View className="flex-row justify-between mb-5">
          {loading ? (
            <>
              {Array(3).fill().map((_, index) => (
                <View key={`stat-skeleton-${index}`} className="flex-1 bg-white rounded-lg p-4 mx-1 items-center shadow">
                  <View className="h-8 w-12 bg-gray-200 rounded mb-1" />
                  <View className="h-4 w-20 bg-gray-200 rounded mt-1" />
                </View>
              ))}
            </>
          ) : (
            stats.map((stat, index) => (
              <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
            ))
          )}
        </View>
        
        {/* Mini Trends Section */}
        <View className="bg-white rounded-lg p-4 mb-5 shadow">
          <Text className="text-lg font-bold mb-3 text-gray-800">Activity Trends</Text>
          
          {loading ? (
            <>
              {/* Weekly Request Chart Skeleton */}
              <View className="mb-4">
                <View className="h-5 w-40 bg-gray-200 rounded mb-2" />
                <View className="mt-2">
                  <View className="flex-row justify-between mb-6">
                    {Array(7).fill().map((_, index) => (
                      <View key={`label-skeleton-${index}`} className="h-3 w-8 bg-gray-200 rounded flex-1 mx-1" />
                    ))}
                  </View>
                  <View className="flex-row justify-between h-32 items-end">
                    {Array(7).fill().map((_, index) => (
                      <View key={`bar-skeleton-${index}`} className="flex-1 mx-1 items-center">
                        <View
                          className="bg-gray-200 rounded-t-md w-8"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                        <View className="h-3 w-6 bg-gray-200 rounded mt-1" />
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Request Status Skeleton */}
              <View className="mb-2">
                <View className="h-5 w-48 bg-gray-200 rounded mb-1" />
                <View className="mt-2">
                  <View className="h-4 w-full bg-gray-200 rounded-full mb-2" />
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full bg-gray-300 mr-1" />
                      <View className="h-4 w-32 bg-gray-200 rounded" />
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full bg-gray-300 mr-1" />
                      <View className="h-4 w-32 bg-gray-200 rounded" />
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Weekly Request Chart */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Weekly Request Activity</Text>
                <SimpleBarChart data={weeklyRequestData} />
              </View>

              {/* Request Status */}
              <View className="mb-2">
                <Text className="text-sm font-medium text-gray-700 mb-1">Request Status (This Month)</Text>
                <ProgressBar fulfilled={requestStatus.fulfilled} pending={requestStatus.pending} />
              </View>
            </>
          )}
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
          
          {loading ? (
            <>
              {Array(3).fill().map((_, index) => (
                <View key={`notification-skeleton-${index}`} className="flex-row items-center bg-white rounded-lg p-3 mb-3 shadow-sm">
                  <View className="bg-gray-200 p-2 rounded-full mr-3" style={{ width: 36, height: 36 }} />
                  <View className="flex-1">
                    <View className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
                    <View className="h-3 w-1/3 bg-gray-200 rounded mt-1" />
                  </View>
                </View>
              ))}
            </>
          ) : recentUpdates.length > 0 ? (
            recentUpdates.map((update, index) => (
              <NotificationItem 
                key={index} 
                message={update.message}
                time={update.time}
                icon={update.icon}
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