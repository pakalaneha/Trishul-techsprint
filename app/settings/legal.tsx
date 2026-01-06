import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';

export default function LegalPrivacyScreen() {
    const router = useRouter();

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-6 pt-4">
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <Ionicons name="arrow-back" size={24} color="#705367" />
                        </TouchableOpacity>
                        <Text className="text-aura-text text-2xl font-bold uppercase tracking-tight">Legal & Privacy</Text>
                    </View>

                    <View className="bg-white/5 border border-white/10 rounded-[40px] p-8 gap-6">
                        <View>
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-widest mb-2">Terms of curation</Text>
                            <Text className="text-aura-textDim text-sm leading-6">
                                By using AURA, you agree to our personalized styling algorithms and data-driven fashion curation. We strive for excellence in every recommendation.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-widest mb-2">Privacy protocol</Text>
                            <Text className="text-aura-textDim text-sm leading-6">
                                Your style DNA is encrypted and used solely for enhancing your personal fashion experience. We do not share your measurements or preferences with third parties.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-widest mb-2">AI Ethics</Text>
                            <Text className="text-aura-textDim text-sm leading-6">
                                Our AI is designed to empower individual expression. We continuously refine our models for inclusivity and style accuracy.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </CosmicBackground>
    );
}
