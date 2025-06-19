// SignupRoleSelect.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignupRoleSelect = ({ role, setRole, nextStep }) => (
    <View className="space-y-8">
        <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Join PlateShare</Text>

        </View>

        <View className="space-y-4">
            <RoleCard
                title="Individual"
                description="Buy surplus meals"
                icon="person-outline"
                selected={role === 'user'}
                onPress={() => setRole('user')}
            />

            <RoleCard
                title="Restaurant"
                description="Sell extra meals"
                icon="restaurant-outline"
                selected={role === 'seller'}
                onPress={() => setRole('seller')}
            />

            <RoleCard
                title="Organization"
                description="Distribute food donations"
                icon="people-outline"
                selected={role === 'org'}
                onPress={() => setRole('org')}
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


export default SignupRoleSelect;



const RoleCard = ({ title, description, icon, selected, onPress }) => (
    <TouchableOpacity
        className={`flex-row items-center p-4 my-2 border-2 rounded-xl ${selected ? 'border-[#00CCBB] bg-[#00CCBB]/5' : 'border-gray-200 bg-white'} shadow-sm ${selected ? 'shadow-[#00CCBB]/20' : 'shadow-gray-200/50'}`}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className={`p-3 rounded-full ${selected ? 'bg-[#00CCBB]/10' : 'bg-gray-100'} mr-3 shadow-xs`}>
            <Ionicons
                name={icon}
                size={22}
                color={selected ? '#00CCBB' : '#6B7280'}
            />
        </View>

        <View className="flex-1">
            <View className="flex-row items-center">
                <Text className={`font-semibold text-base ${selected ? 'text-[#00CCBB]' : 'text-gray-900'}`}>
                    {title}
                </Text>

            </View>
            <Text className="text-gray-500 text-sm mt-0.5">
                {description}
            </Text>
        </View>
        {selected && (
            <Ionicons
                name="checkmark-circle"
                size={30}
                color="#00CCBB"
                className="ml-2"
            />
        )}
        <Ionicons
            name="chevron-forward-outline"
            size={18}
            color={selected ? '#00CCBB' : '#D1D5DB'}
        />
    </TouchableOpacity>
);
