import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { NeoButton } from '../../components/ui/NeoButton';
import { useAuth } from '../../services/authStore';

export default function IdentityPreferencesScreen() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const [name, setName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const handleSave = () => {
        // Logic to save profile updates
        setUser({ ...user, displayName: name, email, phone });
        router.back();
    };

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-6 pt-4">
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <Ionicons name="arrow-back" size={24} color="#CB7896" />
                        </TouchableOpacity>
                        <Text className="text-aura-text text-2xl font-bold uppercase tracking-tight">Identity</Text>
                    </View>

                    <View className="gap-8">
                        <View>
                            <Text className="text-aura-textDim text-xs font-bold uppercase tracking-widest mb-3 ml-2">Full Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                className="bg-white/5 border border-white/10 rounded-3xl p-5 text-aura-text font-medium"
                                placeholder="Enter your name"
                                placeholderTextColor="#705367"
                            />
                        </View>

                        <View>
                            <Text className="text-aura-textDim text-xs font-bold uppercase tracking-widest mb-3 ml-2">Email Address</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                className="bg-white/5 border border-white/10 rounded-3xl p-5 text-aura-text font-medium"
                                placeholder="Enter your email"
                                placeholderTextColor="#705367"
                                keyboardType="email-address"
                            />
                        </View>

                        <View>
                            <Text className="text-aura-textDim text-xs font-bold uppercase tracking-widest mb-3 ml-2">Phone Number</Text>
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                className="bg-white/5 border border-white/10 rounded-3xl p-5 text-aura-text font-medium"
                                placeholder="Enter your phone"
                                placeholderTextColor="#705367"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View className="mt-12">
                        <NeoButton title="Save Archetype" onPress={handleSave} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </CosmicBackground>
    );
}
