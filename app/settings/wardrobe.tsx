import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { NeoButton } from '../../components/ui/NeoButton';

export default function DigitalWardrobeScreen() {
    const router = useRouter();

    const wardrobeItems = [
        { id: 1, name: 'Silk Blouse', category: 'Tops', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' },
        { id: 2, name: 'Couture Skirt', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80' },
    ];

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-6 pt-4">
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <Ionicons name="arrow-back" size={24} color="#CB7896" />
                        </TouchableOpacity>
                        <Text className="text-aura-text text-2xl font-bold uppercase tracking-tight">Wardrobe</Text>
                    </View>

                    <View className="flex-row flex-wrap justify-between gap-y-6">
                        {wardrobeItems.map(item => (
                            <View key={item.id} className="w-[48%] bg-white/5 border border-white/10 rounded-[32px] overflow-hidden p-2">
                                <Image source={{ uri: item.image }} className="w-full h-40 rounded-[28px]" />
                                <View className="p-3">
                                    <Text className="text-aura-text font-bold text-sm mb-1">{item.name}</Text>
                                    <Text className="text-aura-textDim text-[10px] uppercase font-bold tracking-widest">{item.category}</Text>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity className="w-[48%] h-52 border-2 border-dashed border-white/10 rounded-[32px] items-center justify-center gap-2">
                            <Ionicons name="add" size={32} color="#CB7896" />
                            <Text className="text-aura-textDim text-[10px] font-bold uppercase tracking-widest">Add Item</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-12 mb-20">
                        <NeoButton title="Analyze Wardrobe" onPress={() => { }} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </CosmicBackground>
    );
}
