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

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setUser = useAuth((state) => state.setUser);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert("Missing Fields", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const signupData = {
                name,
                username: email.toLowerCase(), // Use full email as username
                email,
                phone: '', // Optional/Missing in UI
                password
            };

            const result = await AuthService.signup(signupData);

            if (result.success) {
                // For now, mock user data for the store
                setUser({ username: signupData.username, loggedIn: true });
                router.replace('/create-aura');
            } else {
                throw new Error(result.error || "Signup failed");
            }
        } catch (error: any) {
            Alert.alert("Signup Failed", error.message || "Could not create account.");
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
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-3">Atelier Creation</Text>
                            <Text className="text-aura-text text-4xl font-bold tracking-tight">Create Identity</Text>
                            <Text className="text-aura-textDim text-sm mt-2 tracking-wide">Join the realm of fashion intelligence.</Text>
                        </View>

                        <View className="space-y-6">
                            <NeoInput
                                icon={<Ionicons name="person-outline" color="#CB7896" size={20} />}
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                            />

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
                                placeholder="Security Key"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View className="mt-10">
                            <NeoButton
                                title={loading ? "Generating Profile..." : "Create Identity"}
                                onPress={handleSignup}
                                icon={!loading && <Ionicons name="sparkles" color="#EFF5F3" size={20} />}
                            />
                        </View>

                        <View className="flex-row justify-center mt-8">
                            <Text className="text-aura-textDim text-xs tracking-wide">Already a member? </Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text className="text-aura-accent text-xs font-bold uppercase tracking-widest">Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </CosmicBackground>
    );
}
