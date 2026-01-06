import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { NeoButton } from '../components/ui/NeoButton';

export default function OutfitDetailScreen() {
    const router = useRouter();
    const { id, name, img, category } = useLocalSearchParams();

    const luxurySpring = (delay: number) => FadeInDown.mass(0.5).damping(18).stiffness(120).delay(delay);

    const composition = [
        { label: 'Material', value: '100% Loro Piana Wool' },
        { label: 'Origin', value: 'Handcrafted in Italy' },
        { label: 'Care', value: 'Dry Clean Only' },
        { label: 'Fit', value: 'Architectural Slim' },
    ];

    return (
        <CosmicBackground>
            <View className="flex-1">
                {/* Hero Image */}
                <View className="h-[60%] w-full">
                    <Image
                        source={{ uri: (img as string) || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <SafeAreaView className="absolute top-0 left-0 right-0 px-5 pt-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-12 h-12 rounded-full items-center justify-center bg-black/40 border border-white/20 backdrop-blur-md"
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* Content Overlay */}
                <View className="flex-1 -mt-20 bg-aura-bg rounded-t-[56px] border-t border-white/10 p-8 shadow-2xl">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                        <Animated.View entering={FadeInUp.delay(200)}>
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-3">
                                {category || 'Outerwear'} Collection
                            </Text>
                            <View className="flex-row justify-between items-start mb-6">
                                <Text className="text-aura-text text-3xl font-bold tracking-tight flex-1">
                                    {name || 'Wool Cashmere Coat'}
                                </Text>
                                <Text className="text-aura-text text-2xl font-light ml-4">$2,450</Text>
                            </View>

                            <Text className="text-aura-textDim text-sm leading-7 mb-10">
                                An essential piece of the Aura collection, this {(Array.isArray(name) ? name[0] : name || 'item').toLowerCase()} is defined by its masterful silhouette and unparalleled texture. Engineered for the modern connoisseur.
                            </Text>

                            {/* Composition Details */}
                            <View className="mb-10">
                                <Text className="text-aura-text text-xs font-bold uppercase tracking-[2px] mb-6 border-b border-white/5 pb-2">Technical Details</Text>
                                <View className="flex-row flex-wrap">
                                    {composition.map((item, index) => (
                                        <View key={index} className="w-1/2 mb-6">
                                            <Text className="text-aura-textDim text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</Text>
                                            <Text className="text-aura-text font-medium text-sm">{item.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* AI Analysis Dropdown (Static Representation) */}
                            <View className="bg-aura-primary/10 border border-aura-primary/20 p-6 rounded-[32px] mb-10">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons name="analytics" size={20} color="#CB7896" className="mr-3" />
                                        <Text className="text-aura-text font-bold text-sm tracking-tight">Personalized Fit Analysis</Text>
                                    </View>
                                    <Ionicons name="chevron-down" size={18} color="#CB7896" />
                                </View>
                            </View>

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <NeoButton
                                        title="Acquire Item"
                                        onPress={() => { }}
                                    />
                                </View>
                                <TouchableOpacity className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 items-center justify-center">
                                    <Ionicons name="bookmark-outline" size={24} color="#CB7896" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </View>
            </View>
        </CosmicBackground>
    );
}
