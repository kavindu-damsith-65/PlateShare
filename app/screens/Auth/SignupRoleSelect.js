// SignupRoleSelect.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignupRoleSelect = ({ role, setRole, nextStep }) => (
    <View className="space-y-8">
        <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Join PlateShare</Text>
            <Text className="text-gray-600 text-center">
                Help reduce food waste by joining as either an individual or organization
            </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 2}}>
            <RoleCard
                title="User"
                description="Purchase surplus meals"
                icon="person-outline"
                selected={role === 'user'}
                onPress={() => setRole('user')}
                style={{ flex: 1, marginRight: 2 }}
            />

            <RoleCard
                title="Organization"
                description="Distribute food donations to those in need"
                icon="people-outline"
                selected={role === 'org'}
                onPress={() => setRole('org')}
                style={{ flex: 1, marginLeft: 2 }}
            />
        </View>

        <TouchableOpacity
            className="bg-[#00CCBB] p-4 rounded-lg  items-center mt-8"
            onPress={nextStep}
        >
            <Text className="text-white font-bold text-lg">Continue</Text>
        </TouchableOpacity>
    </View>
);

const RoleCard = ({ title, description, icon, selected, onPress }) => (
    <TouchableOpacity
        className={`w-[45%] p-6 rounded-xl border-2 ${
            selected ? 'border-[#00CCBB] bg-[#00CCBB10]' : 'border-gray-200'
        } items-center`}
        onPress={onPress}
    >
        <Ionicons
            name={icon}
            size={40}
            color={selected ? '#00CCBB' : '#6B7280'}
            className="mb-4"
        />
        <Text className={`text-lg font-semibold mb-2 ${selected ? 'text-[#00CCBB]' : 'text-gray-800'}`}>
            {title}
        </Text>
        <Text className="text-sm text-gray-600 text-center">{description}</Text>
    </TouchableOpacity>
);

export default SignupRoleSelect;
