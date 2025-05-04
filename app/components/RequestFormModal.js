import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RequestFormModal({ visible, onClose, onSubmit, editingRequest }) {
  const [formData, setFormData] = useState({
    title: '',
    requestType: 'General',
    numberOfPeople: '',
    preferredFoodTypes: [],
    deliveryNeeded: false,
    requestByDateTime: '',
    additionalNotes: '',
    visibility: false // false = Private, true = Public
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Reset form when modal opens or editingRequest changes
  useEffect(() => {
    if (visible) {
      if (editingRequest) {
        // Populate form with existing data
        setFormData({
          title: editingRequest.title || '',
          requestType: editingRequest.requestType || 'General',
          numberOfPeople: editingRequest.numberOfPeople?.toString() || '',
          preferredFoodTypes: editingRequest.preferredFoodTypes || [],
          deliveryNeeded: editingRequest.deliveryNeeded || false,
          requestByDateTime: editingRequest.requestByDateTime || '',
          additionalNotes: editingRequest.additionalNotes || '',
          visibility: editingRequest.visibility === 'Public'
        });
      } else {
        // Reset form for new request
        setFormData({
          title: '',
          requestType: 'General',
          numberOfPeople: '',
          preferredFoodTypes: [],
          deliveryNeeded: false,
          requestByDateTime: '',
          additionalNotes: '',
          visibility: false
        });
      }
    }
  }, [visible, editingRequest]);

  const handleSubmitForm = () => {
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.numberOfPeople || parseInt(formData.numberOfPeople) <= 0) {
      alert('Please enter a valid number of people');
      return;
    }
    
    if (formData.preferredFoodTypes.length === 0) {
      alert('Please select at least one food type');
      return;
    }
    
    if (!formData.requestByDateTime) {
      alert('Please select a request deadline');
      return;
    }
    
    // Convert form data to the format expected by the parent component
    const submissionData = {
      ...formData,
      numberOfPeople: parseInt(formData.numberOfPeople),
      visibility: formData.visibility ? 'Public' : 'Private'
    };
    
    onSubmit(submissionData);
  };

  const toggleFoodType = (food) => {
    if (formData.preferredFoodTypes.includes(food)) {
      setFormData({
        ...formData,
        preferredFoodTypes: formData.preferredFoodTypes.filter(item => item !== food)
      });
    } else {
      setFormData({
        ...formData,
        preferredFoodTypes: [...formData.preferredFoodTypes, food]
      });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // If we already have a date, preserve the time part
      let newDate;
      if (formData.requestByDateTime) {
        const oldDate = new Date(formData.requestByDateTime);
        newDate = new Date(selectedDate);
        newDate.setHours(oldDate.getHours(), oldDate.getMinutes());
      } else {
        newDate = selectedDate;
      }
      setFormData({...formData, requestByDateTime: newDate.toISOString()});

      setShowTimePicker(true)
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // If we already have a date, preserve the date part but update the time
      let newDateTime;
      if (formData.requestByDateTime) {
        const oldDate = new Date(formData.requestByDateTime);
        newDateTime = new Date(oldDate);
        newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      } else {
        // If no date was previously selected, use today with the selected time
        newDateTime = new Date();
        newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      }
      setFormData({...formData, requestByDateTime: newDateTime.toISOString()});
    }
  };

  const showDateTimePickerModal = () => {
    // Show date picker first
    setShowDatePicker(true);
  };

  const requestTypes = ['General', 'Urgent'];
  const foodTypes = ['Rice', 'Burgers', 'Fruits', 'Vegetables', 'Pasta', 'Bread', 'Canned goods'];

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg w-11/12 max-h-5/6 p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              {editingRequest ? 'Edit Request' : 'Create New Request'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="max-h-96">
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Title</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-2"
                placeholder="e.g., Dinner Request for Elderly Home"
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Request Type</Text>
              <View className="flex-row border border-gray-300 rounded-md overflow-hidden">
                {requestTypes.map((type) => (
                  <TouchableOpacity 
                    key={type}
                    className={`flex-1 py-2 px-3 ${formData.requestType === type ? 'bg-[#00CCBB]' : 'bg-white'}`}
                    onPress={() => setFormData({...formData, requestType: type})}
                  >
                    <Text className={`text-center ${formData.requestType === type ? 'text-white' : 'text-gray-700'}`}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Number of People</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-2"
                placeholder="e.g., 25"
                keyboardType="numeric"
                value={formData.numberOfPeople}
                onChangeText={(text) => setFormData({...formData, numberOfPeople: text})}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Preferred Food Types</Text>
              <View className="flex-row flex-wrap">
                {foodTypes.map(food => (
                  <TouchableOpacity 
                    key={food}
                    className={`rounded-full px-3 py-1 m-1 ${
                      formData.preferredFoodTypes.includes(food) ? 'bg-[#00CCBB]' : 'bg-gray-200'
                    }`}
                    onPress={() => toggleFoodType(food)}
                  >
                    <Text className={`text-sm ${
                      formData.preferredFoodTypes.includes(food) ? 'text-white' : 'text-gray-700'
                    }`}>{food}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View className="mb-4 flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-700">Delivery Needed?</Text>
              <Switch 
                value={formData.deliveryNeeded}
                onValueChange={(value) => setFormData({...formData, deliveryNeeded: value})}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Request By Date & Time</Text>
              <TouchableOpacity 
                className="border border-gray-300 rounded-md p-2"
                onPress={showDateTimePickerModal}
              >
                <Text className="text-gray-500">
                  {formData.requestByDateTime 
                    ? formatDate(formData.requestByDateTime)
                    : 'Select date and time'}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={formData.requestByDateTime ? new Date(formData.requestByDateTime) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}
              
              {showTimePicker && (
                <DateTimePicker
                  value={formData.requestByDateTime ? new Date(formData.requestByDateTime) : new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </View>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Additional Notes</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-2"
                placeholder="e.g., No spicy food please"
                multiline
                numberOfLines={3}
                value={formData.additionalNotes}
                onChangeText={(text) => setFormData({...formData, additionalNotes: text})}
              />
            </View>
            
            <View className="mb-4 flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-700">Public Request</Text>
              <Switch 
                value={formData.visibility}
                onValueChange={(value) => setFormData({...formData, visibility: value})}
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            className="bg-[#00CCBB] py-3 rounded-md mt-4"
            onPress={handleSubmitForm}
          >
            <Text className="text-white text-center font-bold">
              {editingRequest ? 'Update Request' : 'Create Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
