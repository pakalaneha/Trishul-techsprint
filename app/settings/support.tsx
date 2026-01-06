import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { NeoButton } from '../../components/ui/NeoButton';

export default function CuratorSupportScreen() {
    const router = useRouter();

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-6 pt-4">
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <Ionicons name="arrow-back" size={24} color="#CB7896" />
                        </TouchableOpacity>
                        <Text className="text-aura-text text-2xl font-bold uppercase tracking-tight">Support</Text>
                    </View>

                    <View className="bg-white/5 border border-white/10 rounded-[40px] p-8 gap-8">
                        <View>
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-widest mb-4 italic">Direct Messaging</Text>
                            <Text className="text-aura-text text-xl font-bold mb-4 tracking-tight">How can we assist your style journey today?</Text>

                            <TextInput
                                multiline
                                numberOfLines={6}
                                className="bg-white/5 border border-white/10 rounded-3xl p-6 text-aura-text font-medium h-48"
                                placeholder="Describe your inquiry..."
                                placeholderTextColor="#705367"
                                style={{ textAlignVertical: 'top' }}
                            />
                        </View>

                        <NeoButton title="Contact Curator" onPress={() => router.back()} />

                        <View className="mt-4 pt-8 border-t border-white/5 gap-4">
                            <TouchableOpacity className="flex-row items-center">
                                <Ionicons name="book-outline" size={20} color="#705367" className="mr-4" />
                                <Text className="text-aura-textDim font-medium">Style Guide & FAQ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center">
                                <Ionicons name="mail-outline" size={20} color="#705367" className="mr-4" />
                                <Text className="text-aura-textDim font-medium">support@aura.fashion</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </CosmicBackground>
    );
}
