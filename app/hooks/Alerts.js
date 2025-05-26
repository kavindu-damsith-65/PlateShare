// components/Alerts.js
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';

export const SuccessAlert = ({ message, onDismiss }) => {
    return (
        <Animated.View className="absolute top-10 left-0 right-0 z-50 px-4">
            <View className="bg-green-100 p-4 rounded-lg border border-green-200 flex-row items-center">
                <CheckCircleIcon size={24} color="#10B981" />
                <Text className="text-green-800 ml-2 flex-1">{message}</Text>
                <TouchableOpacity onPress={onDismiss}>
                    <Text className="text-green-800 font-bold">OK</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export const ErrorAlert = ({ message, onDismiss, onAction }) => {
    return (
        <Animated.View className="absolute top-10 left-0 right-0 z-50 px-4">
            <View className="bg-red-100 p-4 rounded-lg border border-red-200 flex-row items-center">
                <XCircleIcon size={24} color="#EF4444" />
                <View className="ml-2 flex-1">
                    <Text className="text-red-800 font-semibold">Registration Failed</Text>
                    <Text className="text-red-800">{message}</Text>
                </View>
                <View className="flex-row space-x-2">
                    <TouchableOpacity onPress={onDismiss}>
                        <Text className="text-red-800 font-bold">Try Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onAction}>
                        <Text className="text-[#00CCBB] font-bold">Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

export const LoadingRedirect = () => {
    return (
        <View className="flex-1 justify-center items-center bg-white">
            <ActivityIndicator size="large" color="#00CCBB" />
            <Text className="mt-4 text-[#00CCBB]">Redirecting to login...</Text>
        </View>
    );
};
