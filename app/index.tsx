import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { NeoButton } from '../components/ui/NeoButton';
import { useAuth } from '../services/authStore';

export default function LandingScreen() {
    const router = useRouter();
    const setUser = useAuth((state) => state.setUser);
    const setOnboardingCompleted = useAuth((state) => state.setOnboardingCompleted);

    const handleGuestLogin = () => {
        setUser({
            uid: 'guest',
            email: 'guest@aura.app',
            displayName: 'Guest Preview',
            emailVerified: true,
            isAnonymous: true,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: null,
            delete: async () => { },
            getIdToken: async () => '',
            getIdTokenResult: async () => ({} as any),
            reload: async () => { },
            toJSON: () => ({})
        } as any);

        setOnboardingCompleted(true);
        router.replace('/(tabs)/home');
    };

    return (
        <CosmicBackground>
            <StatusBar style="light" />
            <SafeAreaView className="flex-1 justify-between items-center px-6 py-12">

                {/* Hero Section */}
                <Animated.View entering={FadeInDown.delay(300).springify()} className="items-center mt-12 w-full">
                    <View className="mb-6 relative">
                        <Text className="text-aura-text text-8xl font-bold tracking-[8px] text-center" style={{ textShadowColor: '#CB7896', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 15 }}>
                            AURA
                        </Text>
                    </View>
                    <Text className="text-aura-accent text-sm tracking-[6px] uppercase font-bold text-center opacity-90 mt-2">
                        Your AI Fashion Intelligence
                    </Text>
                </Animated.View>

                {/* Main Content Card */}
                <Animated.View entering={FadeInUp.delay(600).springify()} className="w-full">
                    <View className="bg-white/5 border border-white/10 rounded-[48px] p-8 gap-8">
                        <View className="space-y-3">
                            <Text className="text-aura-text text-4xl font-bold text-center leading-tight tracking-tight">
                                Elevate Your <Text className="text-aura-accent italic">Presence</Text>
                            </Text>
                            <Text className="text-aura-textDim text-base text-center font-medium leading-7 mt-2">
                                Personalized AI styling curated for the modern individual. Discover your perfect palette and silhouette.
                            </Text>
                        </View>

                        <View className="gap-4 mt-4">
                            <NeoButton
                                title="Begin Your Journey"
                                onPress={() => router.push('/(auth)/signup')}
                            />

                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/login')}
                                className="py-4 items-center"
                            >
                                <Text className="text-aura-text font-bold tracking-widest uppercase text-xs">I Have An Account</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleGuestLogin}
                                className="py-4 items-center bg-white/5 rounded-3xl border border-white/10"
                            >
                                <Text className="text-aura-textDim font-bold tracking-widest uppercase text-xs">Enter as Guest</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </CosmicBackground>
    );
}
