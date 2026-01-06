import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { GlassPane } from '../../components/ui/GlassPane';
import { NeoButton } from '../../components/ui/NeoButton';
import { useAuth } from '../../services/authStore';

export default function HomeScreen() {
    const router = useRouter();
    const user = useAuth((state) => state.user);

    const luxurySpring = (delay: number) => FadeInDown.mass(0.5).damping(18).stiffness(120).delay(delay);

    const features = [
        { title: 'Personal Stylist', icon: 'sparkles-outline', path: '/(tabs)/styler', color: '#CB7896' },
        { title: 'Color Analysis', icon: 'color-palette-outline', path: '/color-analysis', color: '#705367' },
        { title: 'Skin Analysis', icon: 'water-outline', path: '/(tabs)/care', color: '#CB7896' },
        { title: 'Body Shape', icon: 'body-outline', path: '/body-shape', color: '#705367' },
    ];

    const feedback = [
        { name: 'Sarah J.', text: 'The AI styling is incredibly accurate. ✨', rating: 5 },
        { name: 'Mike D.', text: 'Finally found my signature colors. Minimal effort!', rating: 5 },
        { name: 'Elena R.', text: 'The wardrobe organization is so clean.', rating: 5 },
    ];

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <Animated.View entering={luxurySpring(100)} className="flex-row justify-between items-center mb-10">
                        <View className="flex-row items-center">
                            <View className="relative">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' }}
                                    className="w-14 h-14 rounded-full border-2 border-aura-accent mr-4"
                                />
                            </View>
                            <View>
                                <Text className="text-aura-text text-xl font-bold tracking-tight">Bonjour, {user?.displayName?.split(' ')[0] || 'Olivia'}</Text>
                                <Text className="text-aura-textDim text-xs tracking-[2px] uppercase mt-1">AI STYLE LEVEL 8</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="w-12 h-12 rounded-full items-center justify-center bg-white/5 border border-white/10">
                            <Ionicons name="notifications-outline" size={22} color="#CB7896" />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* AI Style Summary Card */}
                    <Animated.View entering={luxurySpring(200)} className="mb-10">
                        <GlassPane style={{ padding: 24 }}>
                            <View className="flex-row justify-between items-start mb-6">
                                <View>
                                    <Text className="text-aura-accent font-bold text-xs tracking-[3px] uppercase mb-1">AURA ANALYTICS</Text>
                                    <Text className="text-aura-text text-2xl font-bold tracking-tight">Today's Forecast</Text>
                                </View>
                                <View className="bg-aura-primary/10 p-3 rounded-full border border-aura-primary/30">
                                    <Ionicons name="sparkles" size={24} color="#CB7896" />
                                </View>
                            </View>
                            <Text className="text-aura-textDim text-base leading-7 tracking-wide italic mb-6">
                                "Confidence is the best accessory. Today, lean into deep pink and muted violet tones to command presence."
                            </Text>
                            <View className="flex-row justify-between">
                                <View>
                                    <Text className="text-aura-textDim text-[10px] uppercase tracking-widest">Weather</Text>
                                    <Text className="text-aura-text font-bold">72°F Sunny</Text>
                                </View>
                                <View>
                                    <Text className="text-aura-textDim text-[10px] uppercase tracking-widest">Vibe</Text>
                                    <Text className="text-aura-text font-bold">Elegant Professional</Text>
                                </View>
                                <View>
                                    <Text className="text-aura-textDim text-[10px] uppercase tracking-widest">Match</Text>
                                    <Text className="text-aura-accent font-bold">98% Fit</Text>
                                </View>
                            </View>
                        </GlassPane>
                    </Animated.View>

                    {/* Feature Grid */}
                    <Animated.View entering={luxurySpring(300)} className="mb-10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-aura-text text-lg font-bold tracking-widest uppercase">Styling Suites</Text>
                            <View className="h-[1px] flex-1 bg-white/10 ml-4" />
                        </View>
                        <View className="flex-row flex-wrap justify-between">
                            {features.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="w-[48%] mb-4"
                                    onPress={() => router.push(item.path as any)}
                                    activeOpacity={0.8}
                                >
                                    <View className="bg-white/5 border border-white/10 h-32 rounded-[32px] justify-center items-center gap-3">
                                        <View style={{ backgroundColor: `${item.color}20`, padding: 14, borderRadius: 20 }}>
                                            <Ionicons name={item.icon as any} size={28} color={item.color} />
                                        </View>
                                        <Text className="text-aura-text font-bold text-center text-sm tracking-tight">{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Featured Recommendation */}
                    <Animated.View entering={luxurySpring(400)} className="mb-10">
                        <View className="flex-row justify-between items-end mb-6">
                            <View>
                                <Text className="text-aura-textDim text-[10px] uppercase tracking-[3px] mb-1">CURATED FOR YOU</Text>
                                <Text className="text-aura-text text-xl font-bold tracking-tight">Daily Palette</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-aura-accent text-[10px] font-bold tracking-widest uppercase">EXPLORE ALL</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(tabs)/styler')}>
                            <View className="bg-white/5 border border-white/10 p-3 rounded-[40px] flex-row h-52">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80' }}
                                    className="w-[45%] h-full rounded-[30px]"
                                />
                                <View className="flex-1 ml-5 justify-center pr-2">
                                    <Text className="text-aura-accent font-bold text-[10px] uppercase tracking-widest mb-2">Modern Minimalist</Text>
                                    <Text className="text-aura-text text-xl font-bold mb-3 tracking-tight">Structured Elegance</Text>
                                    <Text className="text-aura-textDim text-xs leading-5">Sharp silhouettes paired with warm neutral tones for a timeless look.</Text>
                                    <View className="flex-row mt-4 gap-2">
                                        <View className="w-4 h-4 rounded-full bg-aura-primary" />
                                        <View className="w-4 h-4 rounded-full bg-aura-secondary" />
                                        <View className="w-4 h-4 rounded-full bg-aura-cardAlt" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Community Section */}
                    <Animated.View entering={luxurySpring(500)} className="mb-24">
                        <View className="flex-row justify-between items-center mb-8">
                            <Text className="text-aura-text text-lg font-bold tracking-widest uppercase">Style Collective</Text>
                            <TouchableOpacity className="bg-aura-primary px-6 py-3 rounded-full border border-aura-secondary">
                                <Text className="text-aura-text text-[10px] font-bold tracking-widest uppercase">VOICE YOUR STYLE</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-10">
                            {feedback.map((item, index) => (
                                <View key={index} className="w-64 p-6 mr-4 bg-white/5 border border-white/10 rounded-[32px]">
                                    <View className="flex-row mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name="star"
                                                size={14}
                                                color="#CB7896"
                                                style={{ marginRight: 4 }}
                                            />
                                        ))}
                                    </View>
                                    <Text className="text-aura-text italic text-sm mb-6 leading-6">"{item.text}"</Text>
                                    <View className="flex-row items-center">
                                        <View className="w-8 h-8 rounded-full bg-aura-accent/20 items-center justify-center mr-3">
                                            <Text className="text-aura-accent text-xs font-bold">{item.name[0]}</Text>
                                        </View>
                                        <Text className="text-aura-textDim text-[11px] font-bold tracking-[2px] uppercase">{item.name}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <NeoButton title="Compose New Look" onPress={() => { }} />
                    </Animated.View>

                </ScrollView>
            </SafeAreaView>
        </CosmicBackground>
    );
}
