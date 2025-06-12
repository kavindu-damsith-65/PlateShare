import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SellerRequests from '../../components/Seller/SellerRequests';

export default function SellerRequestsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
            <StatusBar style="dark" />
            <SellerRequests />
        </SafeAreaView>
    );
}