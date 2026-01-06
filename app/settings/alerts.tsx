import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { useAuth } from '../../services/authStore';
import { FlaskApiService } from '../../services/flaskApiService';

export default function IntelligentAlertsScreen() {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const enabled = user?.notifications_enabled ?? true;

    const toggleNotifications = async () => {
        const newVal = !enabled;
        try {
            await FlaskApiService.updateSettings({ notifications: newVal });
            setUser({ ...user, notifications_enabled: newVal });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-6 pt-4">
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <Ionicons name="arrow-back" size={24} color="#CB7896" />
                        </TouchableOpacity>
                        <Text className="text-aura-text text-2xl font-bold uppercase tracking-tight">Alerts</Text>
                    </View>

                    <View className="bg-white/5 border border-white/10 rounded-[40px] p-8 gap-10">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 mr-4">
                                <Text className="text-aura-text font-bold text-lg mb-2">Push Notifications</Text>
                                <Text className="text-aura-textDim text-sm leading-6">Receive daily style forecasts and curated outfit alerts.</Text>
                            </View>
                            <TouchableOpacity
                                onPress={toggleNotifications}
                                className={`w-14 h-8 rounded-full justify-center px-1 ${enabled ? 'bg-aura-accent items-end' : 'bg-white/10 items-start'}`}
                            >
                                <View className="w-6 h-6 bg-white rounded-full shadow-sm" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center justify-between opacity-50">
                            <View className="flex-1 mr-4">
                                <Text className="text-aura-text font-bold text-lg mb-2">Email Digest</Text>
                                <Text className="text-aura-textDim text-sm leading-6">Weekly synthesis of your style evolution and trends.</Text>
                            </View>
                            <View className="w-14 h-8 bg-white/5 rounded-full justify-center px-1 items-start">
                                <View className="w-6 h-6 bg-white/20 rounded-full" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </CosmicBackground>
    );
}
