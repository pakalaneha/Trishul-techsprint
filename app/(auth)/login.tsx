import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { NeoButton } from '../../components/ui/NeoButton';
import { NeoInput } from '../../components/ui/NeoInput';
import { AuthService } from '../../services/authService';
import { useAuth } from '../../services/authStore';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setUser = useAuth((state) => state.setUser);
    const setOnboardingCompleted = useAuth((state) => state.setOnboardingCompleted);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const { user, requiresOnboarding } = await AuthService.login(email, password);
            // @ts-ignore
            setUser(user);

            if (requiresOnboarding) {
                router.replace('/create-aura');
            } else {
                setOnboardingCompleted(true);
                router.replace('/(tabs)/home');
            }
        } catch (error: any) {
            Alert.alert("Login Failed", error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1 justify-center p-6">
                <Animated.View entering={FadeInDown.springify()} className="w-full">
                    <View className="bg-white/5 border border-white/10 p-8 rounded-[48px] backdrop-blur-xl">
                        <View className="mb-10">
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-3">Atelier Entry</Text>
                            <Text className="text-aura-text text-4xl font-bold tracking-tight">Bienvenue</Text>
                            <Text className="text-aura-textDim text-sm mt-2 tracking-wide">Enter your fashion intelligence space.</Text>
                        </View>

                        <View className="space-y-6">
                            <NeoInput
                                icon={<Ionicons name="mail-outline" color="#CB7896" size={20} />}
                                placeholder="Signature Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <NeoInput
                                icon={<Ionicons name="lock-closed-outline" color="#CB7896" size={20} />}
                                placeholder="Access Key"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <TouchableOpacity className="self-end mt-4 mb-8">
                            <Text className="text-aura-textDim text-xs font-bold uppercase tracking-widest">Recovery Access</Text>
                        </TouchableOpacity>

                        <NeoButton
                            title={loading ? "Authenticating..." : "Begin Session"}
                            onPress={handleLogin}
                            icon={!loading && <Ionicons name="chevron-forward" color="#EFF5F3" size={20} />}
                        />

                        <View className="flex-row justify-center mt-8">
                            <Text className="text-aura-textDim text-xs tracking-wide">New to Aura? </Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text className="text-aura-accent text-xs font-bold uppercase tracking-widest">Create Identity</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </CosmicBackground>
    );
}
