import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { NeoButton } from '../../components/ui/NeoButton';
import { useAuth } from '../../services/authStore';
import { DatabaseService } from '../../services/databaseService';

export default function StylerScreen() {
    const user = useAuth((state) => state.user);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [occasion, setOccasion] = useState('');
    const [weather, setWeather] = useState('');
    const [mood, setMood] = useState('');

    const luxurySpring = (delay: number) => FadeInDown.mass(0.5).damping(18).stiffness(120).delay(delay);
    const luxurySpringUp = (delay: number) => FadeInUp.mass(0.5).damping(18).stiffness(120).delay(delay);

    const occasions = ['Casual', 'Work', 'Date Night', 'Party', 'Gym'];
    const weathers = ['Sunny', 'Rainy', 'Cold', 'Windy'];
    const moods = ['Confident', 'Relaxed', 'Edgy', 'Chic'];

    const handleStyleMe = async () => {
        console.log('--- AURA STYLER DIAGNOSTICS ---');
        console.log('Occasion:', occasion);
        console.log('Weather:', weather);
        console.log('Mood:', mood);

        if (!occasion || !weather || !mood) {
            console.warn('Incomplete selection detected.');
            return;
        }

        setLoading(true);

        // Save ensemble to Firebase if user is logged in
        if (user) {
            await DatabaseService.saveStylerResult(user.uid, {
                occasion,
                weather,
                mood,
                // In a real app, you'd save the specific items recommended
            });
        }

        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    const SelectionGroup = ({ title, options, selected, onSelect, delay }: any) => (
        <Animated.View entering={luxurySpring(delay)} className="mb-8">
            <Text className="text-aura-text text-sm font-bold mb-4 tracking-[2px] uppercase">{title}</Text>
            <View className="flex-row flex-wrap gap-3">
                {options.map((opt: string) => (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => onSelect(opt)}
                        className={`px-6 py-3 rounded-full border ${selected === opt ? 'bg-aura-primary/20 border-aura-accent' : 'bg-white/5 border-white/10'}`}
                        activeOpacity={0.7}
                    >
                        <Text className={`font-bold tracking-tight text-xs uppercase ${selected === opt ? 'text-aura-text' : 'text-aura-textDim'}`}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    const ResultView = () => {
        const items = [
            { type: 'Outerwear', name: 'Wool Cashmere Coat', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80', color: '#CB7896' },
            { type: 'Top', name: 'Silk Turtleneck', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80', color: '#705367' },
            { type: 'Bottom', name: 'Tailored Trousers', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80', color: '#CB7896' },
            { type: 'Shoes', name: 'Leather Chelsea Boots', img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80', color: '#705367' },
            { type: 'Accents', name: 'Gold Link Bracelet', img: 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80', color: '#CB7896' },
        ];

        return (
            <Animated.View entering={luxurySpringUp(100)} className="flex-1">
                <View className="flex-row justify-between items-center mb-10">
                    <View>
                        <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-1">Aura Ensemble</Text>
                        <Text className="text-aura-text text-2xl font-bold tracking-tight">{occasion} • {mood}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setStep(1)} className="w-12 h-12 rounded-full items-center justify-center bg-white/5 border border-white/10">
                        <Ionicons name="refresh-outline" size={20} color="#CB7896" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                    {items.map((item, index) => (
                        <Animated.View
                            key={item.type}
                            entering={luxurySpring(index * 150)}
                            className="mb-8"
                        >
                            <View className="flex-row bg-white/5 border border-white/10 p-3 rounded-[32px] items-center">
                                <Image
                                    source={{ uri: item.img }}
                                    className="w-24 h-24 rounded-[24px]"
                                />
                                <View className="flex-1 ml-5 pr-2">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text style={{ color: item.color }} className="text-[10px] font-bold uppercase tracking-[2px]">{item.type}</Text>
                                        <View className="bg-aura-accent/10 px-2 py-0.5 rounded-full">
                                            <Text className="text-aura-accent text-[9px] font-bold uppercase tracking-widest">98% Fit</Text>
                                        </View>
                                    </View>
                                    <Text className="text-aura-text text-lg font-bold mb-1 tracking-tight">{item.name}</Text>
                                    <Text className="text-aura-textDim text-xs leading-5">Sophisticated texture match for your profile.</Text>
                                </View>
                            </View>
                        </Animated.View>
                    ))}

                    <Animated.View entering={luxurySpring(800)}>
                        <View className="p-8 mb-10 bg-aura-primary/10 border border-aura-primary/20 rounded-[40px]">
                            <Text className="text-aura-accent font-bold mb-4 uppercase text-[10px] tracking-[4px]">Stylist Perspective</Text>
                            <Text className="text-aura-text leading-7 text-sm font-medium italic">
                                "This selection creates a powerful, {mood.toLowerCase()} silhouette perfect for your {occasion.toLowerCase()} engagement. The interplay between these textures evokes a sense of effortless luxury."
                            </Text>
                        </View>
                    </Animated.View>

                    <NeoButton
                        title="Draft New Concept"
                        variant="outline"
                        onPress={() => {
                            setOccasion('');
                            setWeather('');
                            setMood('');
                            setStep(1);
                        }}
                        style={{ marginBottom: 40 }}
                    />
                </ScrollView>
            </Animated.View>
        );
    };

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1 px-5 pt-4">
                {step === 1 ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Animated.View entering={luxurySpring(100)} className="mb-10">
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-3">Personal Stylist</Text>
                            <Text className="text-aura-text text-4xl font-bold tracking-tight">Curate Your Look</Text>
                        </Animated.View>

                        <View className="bg-white/5 border border-white/10 p-8 mb-10 rounded-[48px]">
                            <SelectionGroup
                                title="The Occasion"
                                options={occasions}
                                selected={occasion}
                                onSelect={setOccasion}
                                delay={200}
                            />
                            <SelectionGroup
                                title="The Atmosphere"
                                options={weathers}
                                selected={weather}
                                onSelect={setWeather}
                                delay={300}
                            />
                            <SelectionGroup
                                title="The Intention"
                                options={moods}
                                selected={mood}
                                onSelect={setMood}
                                delay={400}
                            />
                        </View>

                        <View className="mb-8">
                            <NeoButton
                                title={loading ? "Synthesizing Look..." : "Generate Ensemble"}
                                onPress={handleStyleMe}
                                icon={!loading && <Ionicons name="sparkles" size={20} color="#EFF5F3" />}
                                disabled={!occasion || !weather || !mood || loading}
                            />
                        </View>

                        {loading && (
                            <View className="mt-4 items-center">
                                <ActivityIndicator size="small" color="#CB7896" />
                                <Text className="text-aura-textDim mt-4 font-bold tracking-[2px] uppercase text-[9px]">Consulting AI Stylist...</Text>
                            </View>
                        )}

                        <View className="h-20" />
                    </ScrollView>
                ) : (
                    <ResultView />
                )}
            </SafeAreaView>
        </CosmicBackground>
    );
}
